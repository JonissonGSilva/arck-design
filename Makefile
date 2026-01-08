.PHONY: help setup install install-frontend install-backend dev dev-frontend dev-backend build build-frontend build-backend preview lint lint-frontend clean clean-frontend clean-backend check-node

# Variáveis
NODE_VERSION := 18
NPM := npm
NODE := node
FRONTEND_DIR := frontend
BACKEND_DIR := backend

# Cores para output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Target padrão
.DEFAULT_GOAL := help

##@ Setup

setup: check-node install ## Instala todas as dependências do projeto (frontend e backend)
	@echo "$(GREEN)✓ Setup concluído com sucesso!$(NC)"
	@echo "$(YELLOW)Execute 'make dev' para iniciar o servidor de desenvolvimento$(NC)"

install: install-frontend install-backend ## Instala dependências do frontend e backend
	@echo "$(GREEN)✓ Todas as dependências instaladas$(NC)"

install-frontend: ## Instala dependências do frontend
	@echo "$(YELLOW)Instalando dependências do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) install
	@echo "$(GREEN)✓ Dependências do frontend instaladas$(NC)"

install-backend: ## Instala dependências do backend (se existir package.json)
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "$(YELLOW)Instalando dependências do backend...$(NC)"; \
		cd $(BACKEND_DIR) && $(NPM) install; \
		echo "$(GREEN)✓ Dependências do backend instaladas$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Backend ainda não possui package.json. Pulando instalação do backend.$(NC)"; \
	fi

check-node: ## Verifica se Node.js está instalado e na versão correta
	@echo "$(YELLOW)Verificando Node.js...$(NC)"
	@which $(NODE) > /dev/null || (echo "$(RED)✗ Node.js não encontrado. Por favor, instale Node.js $(NODE_VERSION)+$(NC)" && exit 1)
	@$(NODE) --version | grep -q "v$(NODE_VERSION)\|v19\|v20\|v21" || (echo "$(YELLOW)⚠ Aviso: Versão do Node.js pode não ser compatível. Recomendado: $(NODE_VERSION)+$(NC)")
	@echo "$(GREEN)✓ Node.js encontrado: $$($(NODE) --version)$(NC)"

##@ Desenvolvimento

dev: dev-frontend ## Inicia o servidor de desenvolvimento do frontend
	@echo "$(GREEN)✓ Servidor de desenvolvimento iniciado$(NC)"

dev-frontend: ## Inicia o servidor de desenvolvimento do frontend
	@echo "$(YELLOW)Iniciando servidor de desenvolvimento do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run dev

dev-backend: ## Inicia o servidor de desenvolvimento do backend (se existir)
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "$(YELLOW)Iniciando servidor de desenvolvimento do backend...$(NC)"; \
		cd $(BACKEND_DIR) && $(NPM) run dev; \
	else \
		echo "$(RED)✗ Backend ainda não possui package.json.$(NC)"; \
	fi

dev-all: dev-frontend dev-backend ## Inicia frontend e backend em paralelo (requer package.json no backend)

##@ Build

build: build-frontend build-backend ## Cria o build de produção do frontend e backend
	@echo "$(GREEN)✓ Build concluído!$(NC)"

build-frontend: ## Cria o build de produção do frontend
	@echo "$(YELLOW)Gerando build de produção do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run build
	@echo "$(GREEN)✓ Build do frontend concluído! Arquivos em $(FRONTEND_DIR)/dist$(NC)"

build-backend: ## Cria o build de produção do backend (se existir)
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "$(YELLOW)Gerando build de produção do backend...$(NC)"; \
		cd $(BACKEND_DIR) && $(NPM) run build 2>/dev/null || echo "$(YELLOW)⚠ Script de build não encontrado no backend$(NC)"; \
		echo "$(GREEN)✓ Build do backend concluído$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Backend ainda não possui package.json. Pulando build do backend.$(NC)"; \
	fi

preview: ## Preview do build de produção do frontend
	@echo "$(YELLOW)Iniciando preview do build do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run preview

##@ Qualidade de Código

lint: lint-frontend ## Executa o linter do frontend
	@echo "$(GREEN)✓ Lint concluído$(NC)"

lint-frontend: ## Executa o linter do frontend
	@echo "$(YELLOW)Executando linter do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run lint

lint-fix: ## Executa o linter e corrige problemas automaticamente no frontend
	@echo "$(YELLOW)Corrigindo problemas do linter do frontend...$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run lint -- --fix || true

##@ Limpeza

clean: clean-frontend clean-backend ## Remove node_modules e arquivos de build de frontend e backend
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

clean-frontend: ## Remove node_modules e arquivos de build do frontend
	@echo "$(YELLOW)Limpando frontend...$(NC)"
	@rm -rf $(FRONTEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/dist
	@rm -rf $(FRONTEND_DIR)/dist-ssr
	@rm -rf $(FRONTEND_DIR)/.vite
	@echo "$(GREEN)✓ Frontend limpo$(NC)"

clean-backend: ## Remove node_modules e arquivos de build do backend
	@echo "$(YELLOW)Limpando backend...$(NC)"
	@rm -rf $(BACKEND_DIR)/node_modules
	@rm -rf $(BACKEND_DIR)/dist
	@echo "$(GREEN)✓ Backend limpo$(NC)"

clean-cache: ## Limpa apenas o cache do Vite
	@echo "$(YELLOW)Limpando cache do Vite...$(NC)"
	@rm -rf $(FRONTEND_DIR)/.vite
	@rm -rf $(FRONTEND_DIR)/dist
	@echo "$(GREEN)✓ Cache limpo$(NC)"

##@ Utilitários

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)ArckDesign - Makefile de Comandos$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

version: ## Mostra a versão do Node.js e npm
	@echo "$(YELLOW)Versões:$(NC)"
	@echo "  Node.js: $$($(NODE) --version)"
	@echo "  npm: $$($(NPM) --version)"

info: ## Mostra informações do projeto
	@echo "$(GREEN)=== Informações do Projeto ===$(NC)"
	@if [ -f "$(FRONTEND_DIR)/package.json" ]; then \
		echo "$(YELLOW)Frontend:$(NC)"; \
		echo "  Nome: $$(grep '"name"' $(FRONTEND_DIR)/package.json | cut -d'"' -f4)"; \
		echo "  Versão: $$(grep '"version"' $(FRONTEND_DIR)/package.json | cut -d'"' -f4)"; \
		echo ""; \
	fi
	@if [ -f "$(BACKEND_DIR)/package.json" ]; then \
		echo "$(YELLOW)Backend:$(NC)"; \
		echo "  Nome: $$(grep '"name"' $(BACKEND_DIR)/package.json | cut -d'"' -f4)"; \
		echo "  Versão: $$(grep '"version"' $(BACKEND_DIR)/package.json | cut -d'"' -f4)"; \
		echo ""; \
	fi
	@echo "$(YELLOW)Scripts disponíveis no frontend:$(NC)"
	@cd $(FRONTEND_DIR) && $(NPM) run --silent 2>/dev/null || echo "  Execute 'make setup' primeiro"

