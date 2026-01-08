# ArckDesign

Plataforma completa para arquitetos e clientes gerenciarem projetos arquitetônicos.

## 📁 Estrutura do Projeto

```
arck-design/
├── frontend/          # Aplicação React + TypeScript + Vite
│   ├── src/          # Código fonte do frontend
│   ├── package.json  # Dependências do frontend
│   └── ...
├── backend/          # Backend (em desenvolvimento)
│   └── README.md     # Documentação do backend
└── docs/             # Documentação do projeto
```

## 🚀 Início Rápido

### Usando Makefile (Linux/Mac) ou make.bat (Windows)

A forma mais fácil de configurar e executar o projeto é usando os comandos Makefile ou make.bat:

**Linux/Mac:**
```bash
# Setup inicial (instala todas as dependências)
make setup

# Iniciar servidor de desenvolvimento
make dev

# Ver todos os comandos disponíveis
make help
```

**Windows:**
```cmd
# Setup inicial (instala todas as dependências)
make.bat setup
# ou no PowerShell: .\make.bat setup

# Iniciar servidor de desenvolvimento
make.bat dev
# ou no PowerShell: .\make.bat dev

# Ver todos os comandos disponíveis
make.bat help
# ou no PowerShell: .\make.bat help
```

### Comandos Disponíveis

#### Setup
- `make setup` / `make.bat setup` - Instala todas as dependências do projeto
- `make install-frontend` / `make.bat install-frontend` - Instala dependências do frontend
- `make install-backend` / `make.bat install-backend` - Instala dependências do backend
- `make check-node` / `make.bat check-node` - Verifica se Node.js está instalado

#### Desenvolvimento
- `make dev` / `make.bat dev` - Inicia servidor de desenvolvimento do frontend
- `make dev-frontend` / `make.bat dev-frontend` - Inicia servidor de desenvolvimento do frontend
- `make dev-backend` / `make.bat dev-backend` - Inicia servidor de desenvolvimento do backend

#### Build
- `make build` / `make.bat build` - Cria build de produção do frontend e backend
- `make build-frontend` / `make.bat build-frontend` - Cria build de produção do frontend
- `make preview` / `make.bat preview` - Preview do build de produção

#### Limpeza
- `make clean` / `make.bat clean` - Remove node_modules e arquivos de build
- `make clean-frontend` / `make.bat clean-frontend` - Limpa apenas o frontend
- `make clean-cache` / `make.bat clean-cache` - Limpa cache do Vite

### Método Manual

Se preferir executar os comandos manualmente:

**Frontend:**
```bash
# Navegar para a pasta frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

**Backend:**

O backend está em desenvolvimento. Consulte `backend/README.md` para mais informações.

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Material UI** - Componentes UI
- **React Router** - Roteamento

### Backend
- 🚧 Em desenvolvimento

## 📚 Documentação

- [Arquitetura Técnica](./docs/ARQUITETURA_TECNICA.md)
- [Funcionalidades](./FUNCIONALIDADES.md)
- [Rotas](./ROTAS.md)
- [Guia de Login](./GUIA_LOGIN.md)

## 👥 Usuários de Teste

### Arquiteto
- Email: `arquiteto@arckdesign.com`
- Senha: `123456`

### Cliente
- Email: `cliente@arckdesign.com`
- Senha: `123456`

## 📝 Licença

Este projeto é privado.
