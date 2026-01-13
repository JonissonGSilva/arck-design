package main

import (
	"log"

	"arck-design/backend/internal/api/rest"
	"arck-design/backend/internal/config"
	"arck-design/backend/internal/database"
	"arck-design/backend/internal/services/cache"
	"arck-design/backend/internal/services/cloudinary"
	"arck-design/backend/internal/services/security"
	"arck-design/backend/internal/services/websocket"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Initialize security token system
	err = security.InitTokenSystem()
	if err != nil {
		log.Fatal("Failed to initialize security token system:", err)
	}

	// Connect to MongoDB
	err = database.ConnectMongoDB()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer database.DisconnectMongoDB()

	// Create indexes
	err = database.CreateIndexes()
	if err != nil {
		log.Printf("Warning: Failed to create some indexes: %v", err)
	}

	// Initialize Cloudinary
	err = cloudinary.InitCloudinary()
	if err != nil {
		log.Printf("Warning: Failed to initialize Cloudinary: %v", err)
	}

	// Initialize Google OAuth - Temporariamente desabilitado
	// auth.InitGoogleOAuth()

	// Initialize Redis cache (optional, will work without it)
	err = cache.InitRedis()
	if err != nil {
		log.Printf("Warning: Redis not available, cache disabled: %v", err)
	}
	defer cache.Close()

	// Initialize WebSocket hub
	websocket.InitWebSocket()
	log.Println("WebSocket hub initialized")

	// Initialize and start server
	router := rest.SetupRouter()

	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
