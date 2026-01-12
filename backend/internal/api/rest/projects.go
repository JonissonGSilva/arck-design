package rest

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"arck-design/backend/internal/models"
	"arck-design/backend/internal/services/project"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func listProjects(c *gin.Context) {
	userID, _ := c.Get("userID")
	userIDStr := userID.(string)

	// Parse query parameters
	status := c.Query("status")
	category := c.Query("category")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	projects, total, err := getProjectsByUser(userIDStr, status, category, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

func createProject(c *gin.Context) {
	userID, _ := c.Get("userID")
	userIDStr := userID.(string)

	var req struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
		Category    string `json:"category" binding:"required"`
		Location    string `json:"location"`
		AccessType  string `json:"accessType"`
		Tags        []string `json:"tags"`
		Specs       *models.ProjectSpecs `json:"specs"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	project := &models.Project{
		UserID:      userObjID,
		Title:       req.Title,
		Description: req.Description,
		Category:    models.ProjectCategory(req.Category),
		Location:    req.Location,
		Status:      models.ProjectStatusDraft,
		AccessType:  models.AccessType(req.AccessType),
		Tags:        req.Tags,
		Specs:       req.Specs,
		Views:       0,
		FilesCount:  0,
		Featured:    false,
	}

	createdProject, err := createProjectInDB(project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProject)
}

func getProject(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	project, err := getProjectByID(projectID, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, project)
}

func updateProject(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProject, err := updateProjectInDB(projectID, userID.(string), req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedProject)
}

func deleteProject(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	err := deleteProjectFromDB(projectID, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func updateProjectVisibility(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	var req struct {
		AccessType string `json:"accessType" binding:"required"`
		Password   string `json:"password,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := updateProjectVisibilityInDB(projectID, userID.(string), req.AccessType, req.Password)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, project)
}

func uploadProjectCover(c *gin.Context) {
	// Verify authentication - userID must exist from authMiddleware
	userID, exists := c.Get("userID")
	if !exists || userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		c.Abort()
		return
	}

	userIDStr, ok := userID.(string)
	if !ok || userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user authentication"})
		c.Abort()
		return
	}

	// TODO: Implement image upload
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func getProjectStats(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	stats, err := getProjectStatsFromDB(projectID, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func getProjectImages(c *gin.Context) {
	projectID := c.Param("id")
	userID, _ := c.Get("userID")

	images, err := getProjectImagesFromDB(projectID, userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}

// Helper functions
func getProjectsByUser(userID, status, category string, page, limit int) ([]*models.Project, int, error) {
	projects, total, err := project.GetProjectsByUser(userID, status, category, page, limit)
	return projects, int(total), err
}

func createProjectInDB(proj *models.Project) (*models.Project, error) {
	return project.CreateProject(proj)
}

func getProjectByID(projectID, userID string) (*models.Project, error) {
	return project.GetProjectByID(projectID, userID)
}

func updateProjectInDB(projectID, userID string, req interface{}) (*models.Project, error) {
	updates := make(map[string]interface{})
	
	// Extract fields from request struct
	reqMap := req.(map[string]interface{})
	if title, ok := reqMap["title"].(string); ok && title != "" {
		updates["title"] = title
	}
	if desc, ok := reqMap["description"].(string); ok && desc != "" {
		updates["description"] = desc
	}
	if cat, ok := reqMap["category"].(string); ok && cat != "" {
		updates["category"] = cat
	}
	if loc, ok := reqMap["location"].(string); ok && loc != "" {
		updates["location"] = loc
	}
	if tags, ok := reqMap["tags"].([]string); ok {
		updates["tags"] = tags
	}
	if specs, ok := reqMap["specs"].(*models.ProjectSpecs); ok {
		updates["specs"] = specs
	}

	return project.UpdateProject(projectID, userID, updates)
}

func deleteProjectFromDB(projectID, userID string) error {
	return project.DeleteProject(projectID, userID)
}

func updateProjectVisibilityInDB(projectID, userID, accessType, password string) (*models.Project, error) {
	return project.UpdateProjectVisibility(projectID, userID, accessType, password)
}

func getProjectStatsFromDB(projectID, userID string) (map[string]interface{}, error) {
	return project.GetProjectStats(projectID, userID)
}

func getProjectImagesFromDB(projectID, userID string) ([]*models.Image, error) {
	return project.GetProjectImages(projectID, userID)
}

