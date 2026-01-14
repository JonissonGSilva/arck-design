package review

import (
	"context"
	"errors"
	"time"

	"arck-design/backend/internal/database"
	"arck-design/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ============================================
// ERROS
// ============================================

var (
	ErrReviewNotFound     = errors.New("avaliação não encontrada")
	ErrUnauthorized       = errors.New("não autorizado")
	ErrAlreadyReviewed    = errors.New("você já avaliou este arquiteto")
	ErrInvalidRating      = errors.New("avaliação deve ser entre 1 e 5")
	ErrCannotReviewSelf   = errors.New("não é possível avaliar a si mesmo")
	ErrArchitectNotFound  = errors.New("arquiteto não encontrado")
)

// ============================================
// TIPOS
// ============================================

// ReviewWithDetails inclui detalhes do cliente
type ReviewWithDetails struct {
	models.Review `bson:",inline"`
	ClientName    string `bson:"clientName" json:"clientName"`
	ClientAvatar  string `bson:"clientAvatar,omitempty" json:"clientAvatar,omitempty"`
	ProjectTitle  string `bson:"projectTitle,omitempty" json:"projectTitle,omitempty"`
}

// ArchitectRatingStats estatísticas de avaliação de um arquiteto
type ArchitectRatingStats struct {
	AverageRating float64         `json:"averageRating"`
	TotalReviews  int64           `json:"totalReviews"`
	Distribution  map[int]int64   `json:"distribution"` // 1-5 estrelas
}

// ============================================
// CRIAR REVIEW
// ============================================

// CreateReview cria uma nova avaliação
func CreateReview(ctx context.Context, review *models.Review) (*models.Review, error) {
	// Validar rating
	if review.Rating < 1 || review.Rating > 5 {
		return nil, ErrInvalidRating
	}

	// Verificar se não está avaliando a si mesmo
	if review.ArchitectID == review.ClientID {
		return nil, ErrCannotReviewSelf
	}

	// Verificar se arquiteto existe
	var architect models.User
	err := database.UsersCollection.FindOne(ctx, bson.M{
		"_id":  review.ArchitectID,
		"role": models.RoleArquiteto,
	}).Decode(&architect)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrArchitectNotFound
		}
		return nil, err
	}

	// Verificar se já existe avaliação do mesmo cliente para este arquiteto
	existingFilter := bson.M{
		"architectId": review.ArchitectID,
		"clientId":    review.ClientID,
	}
	count, err := database.ReviewsCollection.CountDocuments(ctx, existingFilter)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, ErrAlreadyReviewed
	}

	// VALIDAÇÃO: Exigir projeto concluído para permitir avaliação
	if review.ProjectID == nil {
		return nil, errors.New("é necessário ter um projeto concluído para avaliar o arquiteto")
	}

	// Verificar se o projeto existe e está concluído
	var project models.Project
	err = database.ProjectsCollection.FindOne(ctx, bson.M{
		"_id":      review.ProjectID,
		"clientId": review.ClientID,
		"userId":   review.ArchitectID,
	}).Decode(&project)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("projeto não encontrado ou você não tem permissão para avaliar este projeto")
		}
		return nil, err
	}

	// Verificar se o projeto está concluído
	if project.ProjectStatus != models.WorkStatusConcluido {
		return nil, errors.New("apenas projetos concluídos podem ser avaliados")
	}

	// Definir timestamps
	now := time.Now()
	review.ID = primitive.NewObjectID()
	review.CreatedAt = now
	review.UpdatedAt = now
	review.Helpful = 0
	review.Verified = true // Marcar como verificado já que o projeto está concluído

	// Inserir review
	_, err = database.ReviewsCollection.InsertOne(ctx, review)
	if err != nil {
		return nil, err
	}

	// Atualizar média de avaliação do arquiteto (assíncrono seria melhor)
	go updateArchitectRating(context.Background(), review.ArchitectID.Hex())

	return review, nil
}

// ============================================
// LISTAR REVIEWS
// ============================================

// GetReviewsByArchitect retorna avaliações de um arquiteto
func GetReviewsByArchitect(ctx context.Context, architectID string, page, limit int) ([]ReviewWithDetails, int64, error) {
	archObjID, err := primitive.ObjectIDFromHex(architectID)
	if err != nil {
		return nil, 0, err
	}

	// Contar total
	filter := bson.M{"architectId": archObjID}
	total, err := database.ReviewsCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Pipeline para obter reviews com detalhes do cliente
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: filter}},
		{{Key: "$sort", Value: bson.M{"createdAt": -1}}},
		{{Key: "$skip", Value: int64((page - 1) * limit)}},
		{{Key: "$limit", Value: int64(limit)}},
		{{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "clientId",
			"foreignField": "_id",
			"as":           "client",
		}}},
		{{Key: "$unwind", Value: bson.M{
			"path":                       "$client",
			"preserveNullAndEmptyArrays": true,
		}}},
		{{Key: "$lookup", Value: bson.M{
			"from":         "projects",
			"localField":   "projectId",
			"foreignField": "_id",
			"as":           "project",
		}}},
		{{Key: "$unwind", Value: bson.M{
			"path":                       "$project",
			"preserveNullAndEmptyArrays": true,
		}}},
		{{Key: "$addFields", Value: bson.M{
			"clientName":   "$client.name",
			"clientAvatar": "$client.avatar",
			"projectTitle": "$project.title",
		}}},
		{{Key: "$project", Value: bson.M{
			"client":  0,
			"project": 0,
		}}},
	}

	cursor, err := database.ReviewsCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var reviews []ReviewWithDetails
	if err := cursor.All(ctx, &reviews); err != nil {
		return nil, 0, err
	}

	return reviews, total, nil
}

// GetReviewByID obtém uma avaliação por ID
func GetReviewByID(ctx context.Context, reviewID string) (*models.Review, error) {
	objID, err := primitive.ObjectIDFromHex(reviewID)
	if err != nil {
		return nil, err
	}

	var review models.Review
	err = database.ReviewsCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&review)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrReviewNotFound
		}
		return nil, err
	}

	return &review, nil
}

// ============================================
// ATUALIZAR REVIEW
// ============================================

// UpdateReview atualiza uma avaliação (apenas pelo autor)
func UpdateReview(ctx context.Context, reviewID, clientID string, updates *models.Review) (*models.Review, error) {
	objID, err := primitive.ObjectIDFromHex(reviewID)
	if err != nil {
		return nil, err
	}
	clientObjID, err := primitive.ObjectIDFromHex(clientID)
	if err != nil {
		return nil, err
	}

	// Validar rating se fornecido
	if updates.Rating != 0 && (updates.Rating < 1 || updates.Rating > 5) {
		return nil, ErrInvalidRating
	}

	// Verificar se o usuário é o autor
	filter := bson.M{
		"_id":      objID,
		"clientId": clientObjID,
	}

	updateFields := bson.M{
		"updatedAt": time.Now(),
	}

	if updates.Rating != 0 {
		updateFields["rating"] = updates.Rating
	}
	if updates.Comment != "" {
		updateFields["comment"] = updates.Comment
	}

	var review models.Review
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	err = database.ReviewsCollection.FindOneAndUpdate(
		ctx,
		filter,
		bson.M{"$set": updateFields},
		opts,
	).Decode(&review)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrUnauthorized
		}
		return nil, err
	}

	// Atualizar média de avaliação do arquiteto
	go updateArchitectRating(context.Background(), review.ArchitectID.Hex())

	return &review, nil
}

// ============================================
// DELETAR REVIEW
// ============================================

// DeleteReview remove uma avaliação
func DeleteReview(ctx context.Context, reviewID, clientID string) error {
	objID, err := primitive.ObjectIDFromHex(reviewID)
	if err != nil {
		return err
	}
	clientObjID, err := primitive.ObjectIDFromHex(clientID)
	if err != nil {
		return err
	}

	// Obter review para saber o arquiteto
	var review models.Review
	err = database.ReviewsCollection.FindOne(ctx, bson.M{
		"_id":      objID,
		"clientId": clientObjID,
	}).Decode(&review)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrUnauthorized
		}
		return err
	}

	// Deletar
	_, err = database.ReviewsCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	// Atualizar média de avaliação do arquiteto
	go updateArchitectRating(context.Background(), review.ArchitectID.Hex())

	return nil
}

// ============================================
// ESTATÍSTICAS
// ============================================

// GetArchitectRatingStats retorna estatísticas de avaliação de um arquiteto
func GetArchitectRatingStats(ctx context.Context, architectID string) (*ArchitectRatingStats, error) {
	archObjID, err := primitive.ObjectIDFromHex(architectID)
	if err != nil {
		return nil, err
	}

	// Pipeline para calcular estatísticas
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"architectId": archObjID}}},
		{{Key: "$group", Value: bson.M{
			"_id":       nil,
			"avgRating": bson.M{"$avg": "$rating"},
			"total":     bson.M{"$sum": 1},
			"rating1":   bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$rating", 1}}, 1, 0}}},
			"rating2":   bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$rating", 2}}, 1, 0}}},
			"rating3":   bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$rating", 3}}, 1, 0}}},
			"rating4":   bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$rating", 4}}, 1, 0}}},
			"rating5":   bson.M{"$sum": bson.M{"$cond": bson.A{bson.M{"$eq": bson.A{"$rating", 5}}, 1, 0}}},
		}}},
	}

	cursor, err := database.ReviewsCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	stats := &ArchitectRatingStats{
		Distribution: make(map[int]int64),
	}

	if cursor.Next(ctx) {
		var result struct {
			AvgRating float64 `bson:"avgRating"`
			Total     int64   `bson:"total"`
			Rating1   int64   `bson:"rating1"`
			Rating2   int64   `bson:"rating2"`
			Rating3   int64   `bson:"rating3"`
			Rating4   int64   `bson:"rating4"`
			Rating5   int64   `bson:"rating5"`
		}
		if err := cursor.Decode(&result); err == nil {
			stats.AverageRating = result.AvgRating
			stats.TotalReviews = result.Total
			stats.Distribution[1] = result.Rating1
			stats.Distribution[2] = result.Rating2
			stats.Distribution[3] = result.Rating3
			stats.Distribution[4] = result.Rating4
			stats.Distribution[5] = result.Rating5
		}
	}

	return stats, nil
}

// ============================================
// MARCAR COMO ÚTIL
// ============================================

// MarkReviewHelpful incrementa o contador de útil
func MarkReviewHelpful(ctx context.Context, reviewID string) error {
	objID, err := primitive.ObjectIDFromHex(reviewID)
	if err != nil {
		return err
	}

	_, err = database.ReviewsCollection.UpdateByID(ctx, objID, bson.M{
		"$inc": bson.M{"helpful": 1},
	})
	return err
}

// ============================================
// HELPERS
// ============================================

// updateArchitectRating atualiza a média de avaliação no perfil público do arquiteto
func updateArchitectRating(ctx context.Context, architectID string) {
	archObjID, err := primitive.ObjectIDFromHex(architectID)
	if err != nil {
		return
	}

	stats, err := GetArchitectRatingStats(ctx, architectID)
	if err != nil {
		return
	}

	// Atualizar no perfil público
	_, _ = database.PublicProfilesCollection.UpdateOne(
		ctx,
		bson.M{"userId": archObjID},
		bson.M{"$set": bson.M{
			"rating":       stats.AverageRating,
			"reviewsCount": stats.TotalReviews,
			"updatedAt":    time.Now(),
		}},
	)
}

