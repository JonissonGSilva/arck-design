# Backend - ArckDesign

Backend em Go para a plataforma ArckDesign SaaS.

## Estrutura

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Ponto de entrada
├── internal/
│   ├── api/
│   │   └── rest/                   # Rotas REST
│   ├── config/                     # Configurações
│   ├── database/                   # Conexão MongoDB e índices
│   ├── models/                      # Modelos de dados
│   └── services/                    # Serviços de negócio
│       └── auth/                    # Autenticação
├── .env.example                     # Exemplo de variáveis de ambiente
├── go.mod                           # Dependências Go
└── README.md
```

## Tecnologias

- **Go 1.21+**
- **Gin** - Framework web
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **OAuth 2.0** - Login com Google
- **Cloudinary** - Storage de imagens

## Configuração

1. Copie `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente necessárias (MongoDB, Cloudinary, Google OAuth, etc.)

3. Instale as dependências:

```bash
go mod download
```

4. Execute o servidor:

```bash
go run cmd/server/main.go
```

## Endpoints

### Autenticação

- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/oauth/google` - OAuth Google
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Usuário atual

### Projetos

- `GET /api/v1/projects` - Listar projetos
- `POST /api/v1/projects` - Criar projeto
- `GET /api/v1/projects/:id` - Detalhes do projeto
- `PUT /api/v1/projects/:id` - Atualizar projeto
- `DELETE /api/v1/projects/:id` - Deletar projeto
- `PUT /api/v1/projects/:id/visibility` - Alterar visibilidade
- `POST /api/v1/projects/:id/cover` - Upload imagem de capa
- `GET /api/v1/projects/:id/stats` - Estatísticas do projeto
- `GET /api/v1/projects/:id/images` - Imagens do projeto

### Imagens

- `POST /api/v1/images/upload` - Upload de imagem
- `POST /api/v1/images/upload/batch` - Upload múltiplo
- `GET /api/v1/images/:id` - Detalhes da imagem
- `GET /api/v1/images/:id/url` - URLs transformadas
- `PUT /api/v1/images/:id` - Atualizar imagem
- `DELETE /api/v1/images/:id` - Deletar imagem
- `POST /api/v1/images/:id/reprocess` - Reprocessar compressão

## Desenvolvimento

### Executar em modo desenvolvimento

```bash
go run cmd/server/main.go
```

### Build para produção

```bash
go build -o server ./cmd/server
```

### Testes

```bash
go test ./...
```

## Próximos Passos

- [ ] Implementar serviços de projeto
- [ ] Implementar upload de imagens com Cloudinary
- [ ] Implementar compressão de imagens
- [ ] Implementar sistema de mensagens
- [ ] Implementar WebSocket
- [ ] Implementar cache Redis
- [ ] Implementar todos os endpoints restantes
