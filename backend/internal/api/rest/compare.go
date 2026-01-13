package rest

import (
	"context"
	"net/http"
	"strings"
	"time"

	"arck-design/backend/internal/services/compare"

	"github.com/gin-gonic/gin"
)

// ============================================
// HANDLERS DE COMPARAÇÃO
// ============================================

// compareArchitects compara múltiplos arquitetos
func compareArchitects(c *gin.Context) {
	// Receber IDs via query param (separados por vírgula) ou JSON body
	var architectIDs []string

	// Tentar do query param primeiro
	idsParam := c.Query("ids")
	if idsParam != "" {
		architectIDs = strings.Split(idsParam, ",")
		// Limpar espaços
		for i, id := range architectIDs {
			architectIDs[i] = strings.TrimSpace(id)
		}
	} else {
		// Tentar do body
		var req struct {
			ArchitectIDs []string `json:"architectIds"`
		}
		if err := c.ShouldBindJSON(&req); err == nil {
			architectIDs = req.ArchitectIDs
		}
	}

	if len(architectIDs) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "É necessário pelo menos 2 arquitetos para comparação"})
		return
	}

	if len(architectIDs) > 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Máximo de 4 arquitetos para comparação"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	result, err := compare.CompareArchitects(ctx, architectIDs)
	if err != nil {
		if err == compare.ErrMinArchitects {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Arquitetos insuficientes para comparação"})
			return
		}
		if err == compare.ErrTooManyArchitects {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Máximo de 4 arquitetos para comparação"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao comparar arquitetos: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}


