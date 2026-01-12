package rest

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	if gin.Mode() == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// CORS middleware
	router.Use(corsMiddleware())

	// Health check
	router.GET("/health", healthCheck)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", register)
			auth.POST("/login", login)
			// OAuth Google - Temporariamente desabilitado
			// auth.POST("/oauth/google", oauthGoogle)
			auth.POST("/refresh", refreshToken)
			auth.POST("/logout", logout)
			auth.GET("/me", authMiddleware(), getMe)
		}

		// Protected routes
		protected := v1.Group("")
		protected.Use(authMiddleware())
		{
			// Projects
			projects := protected.Group("/projects")
			{
				projects.GET("", listProjects)
				projects.POST("", createProject)
				projects.GET("/:id", getProject)
				projects.PUT("/:id", updateProject)
				projects.DELETE("/:id", deleteProject)
				projects.PUT("/:id/visibility", updateProjectVisibility)
				projects.POST("/:id/cover", uploadProjectCover)
				projects.GET("/:id/stats", getProjectStats)
				projects.GET("/:id/images", getProjectImages)
			}

			// Images
			images := protected.Group("/images")
			{
				images.POST("/upload", uploadImage)
				images.POST("/upload/batch", uploadImagesBatch)
				images.GET("/:id", getImage)
				images.GET("/:id/url", getImageURLs)
				images.PUT("/:id", updateImage)
				images.DELETE("/:id", deleteImage)
				images.POST("/:id/reprocess", reprocessImage)
			}
		}
	}

	return router
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "ok",
		"service": "arck-design-api",
	})
}

