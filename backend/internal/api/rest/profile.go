package rest

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"arck-design/backend/internal/services/profile"

	"github.com/gin-gonic/gin"
)

// ============================================
// HANDLERS DE PERFIL PÚBLICO
// ============================================

// getMyProfile retorna o perfil público do usuário autenticado
func getMyProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	p, err := profile.GetProfileByUserID(ctx, userID.(string))
	if err != nil {
		if err == profile.ErrProfileNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Perfil não encontrado. Crie seu perfil público primeiro."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfil"})
		return
	}

	c.JSON(http.StatusOK, p)
}

// createMyProfile cria o perfil público do usuário
func createMyProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Verificar campos obrigatórios
	displayName, _ := req["displayName"].(string)
	username, _ := req["username"].(string)

	if displayName == "" || username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de exibição e nome de usuário são obrigatórios"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	// Criar perfil básico
	p, err := profile.CreateProfile(ctx, userID.(string), displayName, username)
	if err != nil {
		switch err {
		case profile.ErrUsernameExists:
			c.JSON(http.StatusConflict, gin.H{"error": "Este nome de usuário já está em uso"})
		case profile.ErrInvalidUsername:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de usuário inválido. Use 3-30 caracteres, apenas letras, números, pontos e underscores. Deve começar com letra."})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar perfil: " + err.Error()})
		}
		return
	}

	// Se houver mais campos, atualizar
	delete(req, "displayName")
	delete(req, "username")

	if len(req) > 0 {
		updatedProfile, err := profile.UpdateProfile(ctx, userID.(string), req)
		if err == nil {
			p = updatedProfile
		}
	}

	c.JSON(http.StatusCreated, p)
}

// updateMyProfile atualiza o perfil público do usuário
func updateMyProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Campos permitidos para atualização
	allowedFields := map[string]bool{
		"username":      true,
		"displayName":   true,
		"bio":           true,
		"location":      true,
		"specialty":     true,
		"experience":    true,
		"cau":           true,
		"specialties":   true,
		"education":     true,
		"awards":        true,
		"website":       true,
		"email":         true,
		"phone":         true,
		"social":        true,
		"customization": true,
		"avatar":        true,
		"coverImage":    true,
	}

	updates := make(map[string]interface{})
	for key, value := range req {
		if allowedFields[key] {
			updates[key] = value
		}
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nenhum campo válido para atualização"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	updatedProfile, err := profile.UpdateProfile(ctx, userID.(string), updates)
	if err != nil {
		switch err {
		case profile.ErrProfileNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "Perfil não encontrado"})
		case profile.ErrUsernameExists:
			c.JSON(http.StatusConflict, gin.H{"error": "Este nome de usuário já está em uso"})
		case profile.ErrInvalidUsername:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de usuário inválido"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		}
		return
	}

	c.JSON(http.StatusOK, updatedProfile)
}

// uploadProfileAvatar faz upload do avatar do perfil
func uploadProfileAvatar(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	// TODO: Implementar upload para Cloudinary
	// Por enquanto, apenas recebe a URL
	var req struct {
		AvatarURL string `json:"avatarUrl" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL do avatar é obrigatória"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	err := profile.UpdateProfileAvatar(ctx, userID.(string), req.AvatarURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar avatar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avatar atualizado com sucesso", "avatarUrl": req.AvatarURL})
}

// uploadProfileCover faz upload da imagem de capa do perfil
func uploadProfileCover(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	// TODO: Implementar upload para Cloudinary
	var req struct {
		CoverURL string `json:"coverUrl" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL da imagem de capa é obrigatória"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	err := profile.UpdateProfileCover(ctx, userID.(string), req.CoverURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar imagem de capa"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Imagem de capa atualizada com sucesso", "coverUrl": req.CoverURL})
}

// checkUsernameAvailable verifica se username está disponível
func checkUsernameAvailable(c *gin.Context) {
	username := c.Query("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de usuário é obrigatório"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	available, err := profile.CheckUsernameAvailable(ctx, username)
	if err != nil {
		if err == profile.ErrInvalidUsername {
			c.JSON(http.StatusBadRequest, gin.H{
				"available": false,
				"error":     "Nome de usuário inválido",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar disponibilidade"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"available": available})
}

// ============================================
// HANDLERS PÚBLICOS (SEM AUTENTICAÇÃO)
// ============================================

// getPublicProfile retorna o perfil público pelo username
func getPublicProfile(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de usuário é obrigatório"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	p, err := profile.GetProfileByUsername(ctx, username)
	if err != nil {
		if err == profile.ErrProfileNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Perfil não encontrado"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfil"})
		return
	}

	c.JSON(http.StatusOK, p)
}

// searchProfiles busca perfis públicos
func searchProfiles(c *gin.Context) {
	// Parse dos parâmetros de busca
	category := c.Query("category")
	city := c.Query("city")
	state := c.Query("state")
	search := c.Query("search")
	verifiedStr := c.Query("verified")
	minRatingStr := c.Query("minRating")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}

	filters := profile.ProfileFilters{
		Category: category,
		City:     city,
		State:    state,
		Search:   search,
		Page:     page,
		Limit:    limit,
	}

	if verifiedStr == "true" {
		verified := true
		filters.Verified = &verified
	}

	if minRatingStr != "" {
		if minRating, err := strconv.ParseFloat(minRatingStr, 64); err == nil {
			filters.MinRating = minRating
		}
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	profiles, total, err := profile.SearchProfiles(ctx, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfis"})
		return
	}

	totalPages := (int(total) + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"data":       profiles,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": totalPages,
	})
}

// getNearbyProfiles busca perfis próximos por geolocalização
func getNearbyProfiles(c *gin.Context) {
	latStr := c.Query("lat")
	lngStr := c.Query("lng")
	radiusStr := c.DefaultQuery("radius", "30")
	limitStr := c.DefaultQuery("limit", "20")

	if latStr == "" || lngStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Latitude e longitude são obrigatórios"})
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Latitude inválida"})
		return
	}

	lng, err := strconv.ParseFloat(lngStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Longitude inválida"})
		return
	}

	radius, _ := strconv.ParseFloat(radiusStr, 64)
	if radius <= 0 || radius > 500 {
		radius = 30
	}

	limit, _ := strconv.Atoi(limitStr)
	if limit < 1 || limit > 50 {
		limit = 20
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	profiles, err := profile.GetNearbyProfiles(ctx, lat, lng, radius, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfis próximos"})
		return
	}

	c.JSON(http.StatusOK, profiles)
}

