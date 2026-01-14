package main

import (
	"arck-design/backend/internal/api/rest"
	"arck-design/backend/internal/config"
	"arck-design/backend/internal/database"
	"arck-design/backend/internal/services/cache"
	"arck-design/backend/internal/services/cloudinary"
	"arck-design/backend/internal/services/security"
	"arck-design/backend/internal/services/websocket"
	"arck-design/backend/internal/utils"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		utils.Fatal("Failed to load config: %v", err)
	}

	// Initialize logger based on environment
	utils.InitLogger()
	utils.LogStartupHeader()

	// Initialize security token system
	utils.LogStatus("Security Token System", "Inicializando...", nil)
	err = security.InitTokenSystem()
	if err != nil {
		utils.LogStatus("Security Token System", "Falha na inicialização", err)
		utils.Fatal("Failed to initialize security token system: %v", err)
	}
	utils.LogStatus("Security Token System", "OK", nil)

	// Connect to MongoDB
	utils.LogStatus("MongoDB", "Conectando...", nil)
	err = database.ConnectMongoDB()
	if err != nil {
		utils.LogStatus("MongoDB", "Falha na conexão", err)
		utils.Fatal("Failed to connect to MongoDB: %v", err)
	}
	defer database.DisconnectMongoDB()
	utils.LogStatus("MongoDB", "Conectado", nil)

	// Create indexes
	utils.LogStatus("MongoDB Indexes", "Criando índices...", nil)
	err = database.CreateIndexes()
	if err != nil {
		utils.LogStatus("MongoDB Indexes", "Aviso: Alguns índices falharam", err)
		utils.Warn("Failed to create some indexes: %v", err)
	} else {
		utils.LogStatus("MongoDB Indexes", "OK", nil)
	}

	// Initialize Cloudinary
	utils.LogStatus("Cloudinary", "Inicializando...", nil)
	err = cloudinary.InitCloudinary()
	if err != nil {
		utils.LogStatus("Cloudinary", "Aviso: Falha na inicialização", err)
		utils.Warn("Failed to initialize Cloudinary: %v", err)
	} else {
		utils.LogStatus("Cloudinary", "OK", nil)
	}

	// Initialize Google OAuth - Temporariamente desabilitado
	// auth.InitGoogleOAuth()

	// Initialize Redis cache (optional, will work without it)
	utils.LogStatus("Redis Cache", "Inicializando...", nil)
	err = cache.InitRedis()
	if err != nil {
		utils.LogStatus("Redis Cache", "Aviso: Não disponível, cache desabilitado", err)
		utils.Warn("Redis not available, cache disabled: %v", err)
	} else {
		utils.LogStatus("Redis Cache", "OK", nil)
	}
	defer cache.Close()

	// Initialize WebSocket hub
	utils.LogStatus("WebSocket Hub", "Inicializando...", nil)
	websocket.InitWebSocket()
	utils.LogStatus("WebSocket Hub", "OK", nil)

	// Initialize and start server
	utils.LogStatus("Router", "Configurando rotas...", nil)
	router := rest.SetupRouter()
	utils.LogStatus("Router", "OK", nil)

	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	utils.LogStartupFooter(port)
	
	if err := router.Run(":" + port); err != nil {
		utils.Fatal("Failed to start server: %v", err)
	}
}
