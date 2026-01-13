package rest

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"arck-design/backend/internal/models"
	"arck-design/backend/internal/services/review"
	"arck-design/backend/internal/services/security"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ============================================
// HANDLERS DE AVALIAÇÕES
// ============================================

// createReview cria uma nova avaliação
func createReview(c *gin.Context) {
	clientID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	var req struct {
		ArchitectID string `json:"architectId" binding:"required"`
		ProjectID   string `json:"projectId,omitempty"`
		Rating      int    `json:"rating" binding:"required,min=1,max=5"`
		Comment     string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos. Avaliação deve ser entre 1 e 5."})
		return
	}

	// Decodificar IDs opacos
	architectID, err := security.DecodeUserID(req.ArchitectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de arquiteto inválido"})
		return
	}

	archObjID, err := primitive.ObjectIDFromHex(architectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de arquiteto inválido"})
		return
	}

	clientObjID, err := primitive.ObjectIDFromHex(clientID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno"})
		return
	}

	rev := &models.Review{
		ArchitectID: archObjID,
		ClientID:    clientObjID,
		Rating:      req.Rating,
		Comment:     req.Comment,
	}

	// Decodificar projectId se fornecido
	if req.ProjectID != "" {
		projectID, err := security.DecodeProjectID(req.ProjectID)
		if err == nil {
			projObjID, err := primitive.ObjectIDFromHex(projectID)
			if err == nil {
				rev.ProjectID = &projObjID
			}
		}
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	createdReview, err := review.CreateReview(ctx, rev)
	if err != nil {
		switch err {
		case review.ErrAlreadyReviewed:
			c.JSON(http.StatusConflict, gin.H{"error": "Você já avaliou este arquiteto"})
		case review.ErrCannotReviewSelf:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Não é possível avaliar a si mesmo"})
		case review.ErrArchitectNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Arquiteto não encontrado"})
		case review.ErrInvalidRating:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Avaliação deve ser entre 1 e 5"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar avaliação"})
		}
		return
	}

	c.JSON(http.StatusCreated, createdReview)
}

// getArchitectReviews lista avaliações de um arquiteto
func getArchitectReviews(c *gin.Context) {
	opaqueArchitectID := c.Param("architectId")
	architectID, err := security.DecodeUserID(opaqueArchitectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de arquiteto inválido"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	reviews, total, err := review.GetReviewsByArchitect(ctx, architectID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar avaliações"})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"data":       reviews,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": totalPages,
	})
}

// getArchitectRatingStats obtém estatísticas de avaliação de um arquiteto
func getArchitectRatingStats(c *gin.Context) {
	opaqueArchitectID := c.Param("architectId")
	architectID, err := security.DecodeUserID(opaqueArchitectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de arquiteto inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	stats, err := review.GetArchitectRatingStats(ctx, architectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar estatísticas"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// updateReview atualiza uma avaliação
func updateReview(c *gin.Context) {
	clientID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	opaqueReviewID := c.Param("id")
	reviewID, err := security.DecodeReviewID(opaqueReviewID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de avaliação inválido"})
		return
	}

	var req struct {
		Rating  int    `json:"rating"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	updates := &models.Review{
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	updatedReview, err := review.UpdateReview(ctx, reviewID, clientID.(string), updates)
	if err != nil {
		switch err {
		case review.ErrUnauthorized:
			c.JSON(http.StatusForbidden, gin.H{"error": "Sem permissão para editar esta avaliação"})
		case review.ErrInvalidRating:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Avaliação deve ser entre 1 e 5"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar avaliação"})
		}
		return
	}

	c.JSON(http.StatusOK, updatedReview)
}

// deleteReview deleta uma avaliação
func deleteReview(c *gin.Context) {
	clientID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	opaqueReviewID := c.Param("id")
	reviewID, err := security.DecodeReviewID(opaqueReviewID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de avaliação inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	err = review.DeleteReview(ctx, reviewID, clientID.(string))
	if err != nil {
		if err == review.ErrUnauthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "Sem permissão para deletar esta avaliação"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar avaliação"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avaliação excluída com sucesso"})
}

// markReviewHelpful marca uma avaliação como útil
func markReviewHelpful(c *gin.Context) {
	opaqueReviewID := c.Param("id")
	reviewID, err := security.DecodeReviewID(opaqueReviewID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de avaliação inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	err = review.MarkReviewHelpful(ctx, reviewID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao marcar avaliação como útil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avaliação marcada como útil"})
}

// getMyReviews lista avaliações feitas pelo usuário autenticado
func getMyReviews(c *gin.Context) {
	// TODO: Implementar listagem de reviews do usuário
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Funcionalidade ainda não implementada"})
}

