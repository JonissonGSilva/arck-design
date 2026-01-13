package compare

import (
	"context"
	"errors"

	"arck-design/backend/internal/database"
	"arck-design/backend/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// ============================================
// ERROS
// ============================================

var (
	ErrArchitectNotFound = errors.New("arquiteto não encontrado")
	ErrTooManyArchitects = errors.New("máximo de 4 arquitetos para comparação")
	ErrMinArchitects     = errors.New("mínimo de 2 arquitetos para comparação")
)

// ============================================
// TIPOS
// ============================================

// ArchitectComparisonData representa os dados de um arquiteto para comparação
type ArchitectComparisonData struct {
	ID               string              `json:"id"`
	DisplayName      string              `json:"displayName"`
	Username         string              `json:"username"`
	AvatarURL        string              `json:"avatarURL,omitempty"`
	Bio              string              `json:"bio,omitempty"`
	Specialty        string              `json:"specialty,omitempty"`
	Specialties      []string            `json:"specialties,omitempty"`
	City             string              `json:"city,omitempty"`
	State            string              `json:"state,omitempty"`
	IsVerified       bool                `json:"isVerified"`
	ProjectsCount    int                 `json:"projectsCount"`
	ReviewsCount     int                 `json:"reviewsCount"`
	AverageRating    float64             `json:"averageRating"`
	FavoritesCount   int                 `json:"favoritesCount"`
	AnswersCount     int                 `json:"answersCount"`
	ResponseTime     string              `json:"responseTime,omitempty"` // "< 1h", "< 24h", etc
	YearsExperience  int                 `json:"yearsExperience,omitempty"`
	PriceRange       string              `json:"priceRange,omitempty"`
	MinPrice         float64             `json:"minPrice,omitempty"`
	MaxPrice         float64             `json:"maxPrice,omitempty"`
	ServicesCount    int                 `json:"servicesCount"`
	BadgesCount      int                 `json:"badgesCount"`
	TopBadges        []models.UserBadge  `json:"topBadges,omitempty"`
	PortfolioImages  []string            `json:"portfolioImages,omitempty"` // URLs das primeiras imagens do portfólio
	Social           *models.SocialLinks `json:"social,omitempty"`
	Website          string              `json:"website,omitempty"`
	Email            string              `json:"email,omitempty"`
	Phone            string              `json:"phone,omitempty"`
}

// ComparisonResult representa o resultado da comparação
type ComparisonResult struct {
	Architects []ArchitectComparisonData `json:"architects"`
	Metrics    ComparisonMetrics         `json:"metrics"`
}

// ComparisonMetrics representa métricas comparativas
type ComparisonMetrics struct {
	HighestRated      string  `json:"highestRated"`      // ID do mais bem avaliado
	MostProjects      string  `json:"mostProjects"`      // ID com mais projetos
	MostReviews       string  `json:"mostReviews"`       // ID com mais reviews
	FastestResponse   string  `json:"fastestResponse"`   // ID com resposta mais rápida
	MostExperienced   string  `json:"mostExperienced"`   // ID com mais experiência
	BestValue         string  `json:"bestValue"`         // ID com melhor custo-benefício
	AverageRating     float64 `json:"averageRating"`     // Média geral
	AverageProjects   float64 `json:"averageProjects"`   // Média de projetos
}

// ============================================
// FUNÇÕES
// ============================================

// CompareArchitects compara múltiplos arquitetos
func CompareArchitects(ctx context.Context, architectIDs []string) (*ComparisonResult, error) {
	if len(architectIDs) < 2 {
		return nil, ErrMinArchitects
	}
	if len(architectIDs) > 4 {
		return nil, ErrTooManyArchitects
	}

	architects := make([]ArchitectComparisonData, 0, len(architectIDs))

	for _, idStr := range architectIDs {
		data, err := getArchitectComparisonData(ctx, idStr)
		if err != nil {
			if errors.Is(err, ErrArchitectNotFound) {
				continue // Pular arquitetos não encontrados
			}
			return nil, err
		}
		architects = append(architects, *data)
	}

	if len(architects) < 2 {
		return nil, ErrMinArchitects
	}

	// Calcular métricas comparativas
	metrics := calculateComparisonMetrics(architects)

	return &ComparisonResult{
		Architects: architects,
		Metrics:    metrics,
	}, nil
}

// getArchitectComparisonData busca os dados de um arquiteto para comparação
func getArchitectComparisonData(ctx context.Context, architectID string) (*ArchitectComparisonData, error) {
	architectOID, err := primitive.ObjectIDFromHex(architectID)
	if err != nil {
		return nil, err
	}

	// Buscar perfil público
	var profile models.PublicProfile
	err = database.PublicProfilesCollection.FindOne(ctx, bson.M{"userId": architectOID}).Decode(&profile)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, ErrArchitectNotFound
		}
		return nil, err
	}

	data := &ArchitectComparisonData{
		ID:           architectID,
		DisplayName:  profile.DisplayName,
		Username:     profile.Username,
		AvatarURL:    profile.Avatar,
		Bio:          profile.Bio,
		Specialty:    profile.Specialty,
		Specialties:  profile.Specialties,
		Social:       profile.Social,
		Website:      profile.Website,
		Email:        profile.Email,
		Phone:        profile.Phone,
	}

	// Preencher localização se existir
	if profile.Location != nil && profile.Location.Address != nil {
		data.City = profile.Location.Address.City
		data.State = profile.Location.Address.State
	}

	// Preencher verificação se existir
	if profile.Verification != nil {
		data.IsVerified = profile.Verification.Verified
	}

	// Contar projetos
	projectsCount, err := database.ProjectsCollection.CountDocuments(ctx, bson.M{
		"userId":      architectOID,
		"isPublished": true,
	})
	if err == nil {
		data.ProjectsCount = int(projectsCount)
	}

	// Buscar reviews e calcular média
	reviewPipeline := []bson.M{
		{"$match": bson.M{"architectId": architectOID}},
		{"$group": bson.M{
			"_id":   nil,
			"count": bson.M{"$sum": 1},
			"avg":   bson.M{"$avg": "$rating"},
		}},
	}
	cursor, err := database.ReviewsCollection.Aggregate(ctx, reviewPipeline)
	if err == nil {
		var result []bson.M
		if err := cursor.All(ctx, &result); err == nil && len(result) > 0 {
			if count, ok := result[0]["count"].(int32); ok {
				data.ReviewsCount = int(count)
			}
			if avg, ok := result[0]["avg"].(float64); ok {
				data.AverageRating = avg
			}
		}
	}

	// Contar favoritos
	favoritesCount, err := database.FavoritesCollection.CountDocuments(ctx, bson.M{
		"architectId": architectOID,
	})
	if err == nil {
		data.FavoritesCount = int(favoritesCount)
	}

	// Contar respostas
	answersPipeline := []bson.M{
		{"$unwind": "$answers"},
		{"$match": bson.M{"answers.architectId": architectOID}},
		{"$count": "total"},
	}
	cursor, err = database.QuestionsCollection.Aggregate(ctx, answersPipeline)
	if err == nil {
		var result []bson.M
		if err := cursor.All(ctx, &result); err == nil && len(result) > 0 {
			if total, ok := result[0]["total"].(int32); ok {
				data.AnswersCount = int(total)
			}
		}
	}

	// Contar serviços
	servicesCount, err := database.ServicesCollection.CountDocuments(ctx, bson.M{
		"architectId": architectOID,
		"isActive":    true,
	})
	if err == nil {
		data.ServicesCount = int(servicesCount)
	}

	// Buscar range de preços dos serviços
	pricePipeline := []bson.M{
		{"$match": bson.M{"architectId": architectOID, "isActive": true}},
		{"$group": bson.M{
			"_id":      nil,
			"minPrice": bson.M{"$min": "$price"},
			"maxPrice": bson.M{"$max": "$price"},
		}},
	}
	cursor, err = database.ServicesCollection.Aggregate(ctx, pricePipeline)
	if err == nil {
		var result []bson.M
		if err := cursor.All(ctx, &result); err == nil && len(result) > 0 {
			if minP, ok := result[0]["minPrice"].(float64); ok {
				data.MinPrice = minP
			}
			if maxP, ok := result[0]["maxPrice"].(float64); ok {
				data.MaxPrice = maxP
			}
			if data.MinPrice > 0 && data.MaxPrice > 0 {
				data.PriceRange = formatPriceRange(data.MinPrice, data.MaxPrice)
			}
		}
	}

	// Contar badges
	badgesCount, err := database.BadgesCollection.CountDocuments(ctx, bson.M{
		"userId": architectOID,
	})
	if err == nil {
		data.BadgesCount = int(badgesCount)
	}

	// Buscar imagens do portfólio (primeiras 3)
	projectCursor, err := database.ProjectsCollection.Find(ctx, bson.M{
		"userId":      architectOID,
		"isPublished": true,
	})
	if err == nil {
		defer projectCursor.Close(ctx)
		var projects []bson.M
		if err := projectCursor.All(ctx, &projects); err == nil {
			images := []string{}
			for _, p := range projects {
				if coverImage, ok := p["coverImage"].(string); ok && coverImage != "" {
					images = append(images, coverImage)
					if len(images) >= 3 {
						break
					}
				}
			}
			data.PortfolioImages = images
		}
	}

	return data, nil
}

// formatPriceRange formata o range de preços
func formatPriceRange(min, max float64) string {
	if min == max {
		return formatPrice(min)
	}
	return formatPrice(min) + " - " + formatPrice(max)
}

// formatPrice formata um preço
func formatPrice(price float64) string {
	if price >= 1000 {
		return "R$ " + formatNumber(price/1000) + "k"
	}
	return "R$ " + formatNumber(price)
}

// formatNumber formata um número
func formatNumber(n float64) string {
	if n == float64(int(n)) {
		return string(rune('0'+int(n)%10) + '0')
	}
	return string(rune('0'+int(n)%10) + '0')
}

// calculateComparisonMetrics calcula as métricas comparativas
func calculateComparisonMetrics(architects []ArchitectComparisonData) ComparisonMetrics {
	metrics := ComparisonMetrics{}

	if len(architects) == 0 {
		return metrics
	}

	highestRating := 0.0
	mostProjects := 0
	mostReviews := 0
	mostExperience := 0
	totalRating := 0.0
	totalProjects := 0

	for _, a := range architects {
		if a.AverageRating > highestRating {
			highestRating = a.AverageRating
			metrics.HighestRated = a.ID
		}
		if a.ProjectsCount > mostProjects {
			mostProjects = a.ProjectsCount
			metrics.MostProjects = a.ID
		}
		if a.ReviewsCount > mostReviews {
			mostReviews = a.ReviewsCount
			metrics.MostReviews = a.ID
		}
		if a.YearsExperience > mostExperience {
			mostExperience = a.YearsExperience
			metrics.MostExperienced = a.ID
		}

		totalRating += a.AverageRating
		totalProjects += a.ProjectsCount
	}

	if len(architects) > 0 {
		metrics.AverageRating = totalRating / float64(len(architects))
		metrics.AverageProjects = float64(totalProjects) / float64(len(architects))
	}

	// Best value: melhor rating com menor preço
	bestValue := ""
	bestValueScore := 0.0
	for _, a := range architects {
		if a.MinPrice > 0 && a.AverageRating > 0 {
			score := a.AverageRating / a.MinPrice * 1000
			if score > bestValueScore {
				bestValueScore = score
				bestValue = a.ID
			}
		}
	}
	metrics.BestValue = bestValue

	return metrics
}

