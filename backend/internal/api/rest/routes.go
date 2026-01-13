package rest

import (
	"arck-design/backend/internal/services/websocket"
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

	// WebSocket endpoint (authentication via query param)
	router.GET("/ws", websocket.HandleWebSocket)

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

			// Messages
			messages := protected.Group("/messages")
			{
				messages.GET("/conversations", listConversations)
				messages.POST("/conversations", startConversation)
				messages.GET("/conversations/:id", getConversation)
				messages.GET("/conversations/:id/messages", getMessages)
				messages.PUT("/conversations/:id/read", markAsRead)
				messages.POST("", sendMessage)
				messages.DELETE("/:id", deleteMessage)
				messages.GET("/unread-count", getUnreadCount)
			}

			// Services (Architect)
			services := protected.Group("/services")
			{
				services.GET("", listServices)
				services.POST("", createService)
				services.GET("/stats", getServiceStats)
				services.GET("/:id", getService)
				services.PUT("/:id", updateService)
				services.DELETE("/:id", deleteService)
				services.PUT("/:id/toggle", toggleServiceActive)
			}

			// Events/Calendar
			events := protected.Group("/events")
			{
				events.GET("", listEvents)
				events.POST("", createEvent)
				events.GET("/upcoming", getUpcomingEvents)
				events.GET("/:id", getEvent)
				events.PUT("/:id", updateEvent)
				events.DELETE("/:id", deleteEvent)
				events.PUT("/:id/status", updateEventStatus)
			}

			// Profile (authenticated)
			profileGroup := protected.Group("/profile")
			{
				profileGroup.GET("/me", getMyProfile)
				profileGroup.POST("", createMyProfile)
				profileGroup.PUT("", updateMyProfile)
				profileGroup.POST("/avatar", uploadProfileAvatar)
				profileGroup.POST("/cover", uploadProfileCover)
				profileGroup.GET("/check-username", checkUsernameAvailable)
				// Verificação
				profileGroup.GET("/verification/status", getVerificationStatus)
				profileGroup.POST("/verification/upload", uploadVerificationDocument)
			}

			// Favorites (Client)
			favorites := protected.Group("/favorites")
			{
				favorites.GET("", listFavorites)
				favorites.POST("/:architectId", addFavorite)
				favorites.DELETE("/:architectId", removeFavorite)
				favorites.GET("/check/:architectId", checkFavorite)
			}

			// Dashboard - Architect
			architectDash := protected.Group("/architect/dashboard")
			{
				architectDash.GET("/stats", getArchitectDashboardStats)
				architectDash.GET("/recent-projects", getArchitectRecentProjects)
				architectDash.GET("/upcoming-events", getArchitectUpcomingEvents)
			}

			// Dashboard - Client
			clientDash := protected.Group("/client/dashboard")
			{
				clientDash.GET("/stats", getClientDashboardStats)
				clientDash.GET("/projects", getClientProjects)
				clientDash.GET("/appointments", getClientAppointments)
			}

			// Settings
			settingsGroup := protected.Group("/settings")
			{
				settingsGroup.GET("", getSettings)
				settingsGroup.PUT("/notifications", updateNotifications)
				settingsGroup.PUT("/preferences", updatePreferences)
				settingsGroup.PUT("/privacy", updatePrivacy)
			}

			// Account
			account := protected.Group("/account")
			{
				account.GET("/profile", getProfile)
				account.PUT("/profile", updateProfile)
				account.PUT("/password", changePassword)
				account.DELETE("", deleteAccount)
			}

			// Notifications
			notifications := protected.Group("/notifications")
			{
				notifications.GET("", listNotifications)
				notifications.GET("/unread-count", getUnreadNotificationCount)
				notifications.PUT("/:id/read", markNotificationAsRead)
				notifications.PUT("/read-all", markAllNotificationsAsRead)
				notifications.DELETE("/:id", deleteNotification)
				notifications.GET("/preferences", getNotificationPreferences)
				notifications.PUT("/preferences", updateNotificationPreferences)
			}

			// Reviews (authenticated - create/update/delete)
			reviews := protected.Group("/reviews")
			{
				reviews.POST("", createReview)
				reviews.GET("/my", getMyReviews)
				reviews.PUT("/:id", updateReview)
				reviews.DELETE("/:id", deleteReview)
				reviews.POST("/:id/helpful", markReviewHelpful)
			}

			// Admin routes (TODO: adicionar middleware de verificação de admin)
			admin := protected.Group("/admin")
			{
				// Verificações
				verifications := admin.Group("/verifications")
				{
					verifications.GET("/pending", listPendingVerifications)
					verifications.GET("/:id", getVerificationDetails)
					verifications.POST("/:id/approve", approveVerification)
					verifications.POST("/:id/reject", rejectVerification)
				}
			}
		}

		// Public routes (no auth required)
		public := v1.Group("/public")
		{
			// Public architect services
			public.GET("/architects/:architectId/services", getPublicArchitectServices)

			// Public architect reviews
			public.GET("/architects/:architectId/reviews", getArchitectReviews)
			public.GET("/architects/:architectId/rating", getArchitectRatingStats)
		}

		// Explore routes (public)
		explore := v1.Group("/explore")
		{
			explore.GET("/architects", searchProfiles)
			explore.GET("/architects/nearby", getNearbyProfiles)
			explore.GET("/profile/:username", getPublicProfile)
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

