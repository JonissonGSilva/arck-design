package main

import (
	"log"

	"arck-design/backend/internal/api/rest"
	"arck-design/backend/internal/config"
	"arck-design/backend/internal/database"
	"arck-design/backend/internal/services/cloudinary"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load config:", err)
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

