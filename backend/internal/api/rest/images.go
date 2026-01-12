package rest

import (
	"context"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"arck-design/backend/internal/services/image"
)

func uploadImage(c *gin.Context) {
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

	projectID := c.PostForm("projectId")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "projectId is required"})
		return
	}

	// Get file from form
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// Open file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open file"})
		return
	}
	defer src.Close()

	// Read file data
	fileData, err := io.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}

	// Upload image
	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	uploadedImage, err := image.UploadImage(ctx, fileData, file.Filename, projectID, userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, uploadedImage)
}

func uploadImagesBatch(c *gin.Context) {
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

	// TODO: Implement batch image upload
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func getImage(c *gin.Context) {
	// TODO: Implement get image
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func getImageURLs(c *gin.Context) {
	// TODO: Implement get image URLs
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func updateImage(c *gin.Context) {
	// TODO: Implement update image
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func deleteImage(c *gin.Context) {
	// TODO: Implement delete image
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

func reprocessImage(c *gin.Context) {
	// TODO: Implement reprocess image
	c.JSON(http.StatusNotImplemented, gin.H{"error": "Not implemented yet"})
}

