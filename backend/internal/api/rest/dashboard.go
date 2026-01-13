package rest

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"arck-design/backend/internal/services/dashboard"

	"github.com/gin-gonic/gin"
)

// ============================================
// HANDLERS DE DASHBOARD - ARQUITETO
// ============================================

// getArchitectDashboardStats retorna estatísticas do arquiteto
func getArchitectDashboardStats(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	stats, err := dashboard.GetArchitectStats(ctx, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar estatísticas"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// getArchitectRecentProjects retorna projetos recentes do arquiteto
func getArchitectRecentProjects(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit < 1 || limit > 10 {
		limit = 5
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	projects, err := dashboard.GetRecentProjects(ctx, userID.(string), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar projetos"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// getArchitectUpcomingEvents retorna eventos próximos do arquiteto
func getArchitectUpcomingEvents(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit < 1 || limit > 10 {
		limit = 5
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	events, err := dashboard.GetUpcomingEvents(ctx, userID.(string), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar eventos"})
		return
	}

	c.JSON(http.StatusOK, events)
}

// ============================================
// HANDLERS DE DASHBOARD - CLIENTE
// ============================================

// getClientDashboardStats retorna estatísticas do cliente
func getClientDashboardStats(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	stats, err := dashboard.GetClientStats(ctx, userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar estatísticas"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// getClientProjects retorna projetos do cliente
func getClientProjects(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit < 1 || limit > 10 {
		limit = 5
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	projects, err := dashboard.GetClientProjects(ctx, userID.(string), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar projetos"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// getClientAppointments retorna agendamentos do cliente
func getClientAppointments(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit < 1 || limit > 10 {
		limit = 5
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	appointments, err := dashboard.GetClientAppointments(ctx, userID.(string), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar agendamentos"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

