package rest

import (
	"arck-design/backend/internal/config"
	"arck-design/backend/internal/services/websocket"
	"arck-design/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	// Configurar modo do Gin baseado no ambiente
	env := config.AppConfig.Env
	if env == "development" || env == "dev" {
		gin.SetMode(gin.DebugMode)
		utils.Debug("Gin mode: DEBUG")
	} else {
		gin.SetMode(gin.ReleaseMode)
		utils.Info("Gin mode: RELEASE")
	}

	router := gin.Default()
	
	// Configurar limite de tamanho para multipart forms (100MB)
	router.MaxMultipartMemory = 100 << 20 // 100 MB

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

			// 3D Models
			models3d := protected.Group("/models3d")
			{
				models3d.POST("/upload", uploadModel3D)
				models3d.GET("", listModels3D)
				models3d.GET("/stats", getModel3DStats)
				models3d.GET("/formats", getSupportedFormats)
				models3d.GET("/:id", getModel3D)
				models3d.PUT("/:id", updateModel3D)
				models3d.DELETE("/:id", deleteModel3D)
				models3d.GET("/:id/download", downloadModel3D)
				models3d.POST("/:id/retry", retryModel3DProcessing)
				models3d.GET("/project/:projectId", getModel3DsByProject)
			}

			// Messages
			messages := protected.Group("/messages")
			{
				messages.GET("/conversations", listConversations)
				messages.POST("/conversations", startConversation)
				messages.GET("/conversations/:id/messages", getMessages)
				messages.PUT("/conversations/:id/read", markAsRead)
				messages.GET("/conversations/:id", getConversation)
				messages.DELETE("/conversations/:id", deleteConversation)
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
				profileGroup.PUT("/location", updateMyLocation)
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

			// Questions (perguntas ao especialista)
			questions := protected.Group("/questions")
			{
				questions.GET("", listQuestions)
				questions.POST("", createQuestion)
				questions.GET("/stats", getQuestionStats)
				questions.GET("/popular", getPopularQuestions)
				questions.GET("/:id", getQuestionByID)
				questions.PUT("/:id", updateQuestion)
				questions.DELETE("/:id", deleteQuestion)
				questions.PUT("/:id/close", closeQuestion)
				questions.POST("/:id/answers", addAnswer)
				questions.PUT("/:id/answers/:answerId/best", markBestAnswer)
				questions.POST("/:id/answers/:answerId/helpful", markAnswerHelpful)
			}

			// Blog (authenticated - create/update/delete)
			blogAuth := protected.Group("/blog")
			{
				blogAuth.POST("/posts", createBlogPost)
				blogAuth.PUT("/posts/:id", updateBlogPost)
				blogAuth.DELETE("/posts/:id", deleteBlogPost)
				blogAuth.POST("/posts/:id/like", likeBlogPost)
				blogAuth.DELETE("/posts/:id/like", unlikeBlogPost)
				blogAuth.GET("/posts/my", getMyBlogPosts)
				blogAuth.GET("/stats", getBlogStats)
			}

			// Analytics (authenticated)
			analyticsGroup := protected.Group("/analytics")
			{
				analyticsGroup.GET("/overview", getAnalyticsOverview)
				analyticsGroup.GET("/comparison", getAnalyticsComparison)
				analyticsGroup.GET("/projects/:id", getProjectAnalytics)
			}

			// Badges (authenticated)
			badgesGroup := protected.Group("/badges")
			{
				badgesGroup.GET("/my", getMyBadges)
				badgesGroup.GET("/my/summary", getMyBadgeSummary)
				badgesGroup.POST("/check", checkAndAwardBadges)
				badgesGroup.PUT("/:id/display", updateBadgeDisplay)
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

				// Badges admin
				adminBadges := admin.Group("/badges")
				{
					adminBadges.POST("/initialize", initializeBadges)
					adminBadges.POST("/award", awardBadgeToUser)
					adminBadges.DELETE("/:id", revokeBadgeFromUser)
				}
			}
		}

		// Public routes (no auth required)
		public := v1.Group("/public")
		{
			// Public architect services
			public.GET("/architects/:architectId/services", getPublicArchitectServices)

			// Public 3D Models
			public.GET("/models3d/:id", getPublicModel3D)

			// Public architect reviews
			public.GET("/architects/:architectId/reviews", getArchitectReviews)
			public.GET("/architects/:architectId/rating", getArchitectRatingStats)

			// Public badges
			public.GET("/badges", getAllBadges)
			public.GET("/badges/:id", getBadgeByID)
			public.GET("/users/:userId/badges", getUserBadgesPublic)

			// Public questions routes
			public.GET("/questions", listQuestions)
			public.GET("/questions/popular", getPopularQuestions)
			public.GET("/questions/:id", getQuestionByID)
			public.GET("/questions/architect/:architectId", getQuestionsByArchitect)

			// Public blog routes
			public.GET("/blog/posts", listBlogPosts)
			public.GET("/blog/posts/featured", getFeaturedBlogPosts)
			public.GET("/blog/posts/popular", getPopularBlogPosts)
			public.GET("/blog/posts/recent", getRecentBlogPosts)
			public.GET("/blog/posts/related/:postId", getRelatedBlogPosts)
			public.GET("/blog/posts/by-slug/:slug", getBlogPostBySlug)
			public.GET("/blog/categories", getBlogCategories)
			public.GET("/blog/author/:authorId", getBlogPostsByAuthor)
		}

		// Explore routes (public)
		explore := v1.Group("/explore")
		{
			explore.GET("/architects", searchProfiles)
			explore.GET("/architects/nearby", getNearbyProfiles)
			explore.GET("/architects/compare", compareArchitects)
			explore.POST("/architects/compare", compareArchitects)
			explore.GET("/profile/:username", getPublicProfile)
		}

		// Geolocation routes (public)
		geo := v1.Group("/geo")
		{
			geo.GET("/nearby", searchNearby)
			geo.GET("/search", searchByLocation)
			geo.GET("/my-location", getLocationFromIP)
			geo.GET("/cities", getAvailableCities)
			geo.GET("/states", getAvailableStates)
			geo.GET("/distance", calculateDistance)
		}

		// Analytics tracking (public - for tracking anonymous visitors)
		v1.POST("/analytics/track", trackAnalyticsEvent)
	}

	return router
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "ok",
		"service": "arck-design-api",
	})
}

