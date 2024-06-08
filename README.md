# Movie Catalog API

## Funcionalidades

- CRUD de filmes
- Autenticação JWT
- Cache com Redis
- Documentação de API com Swagger

## Tecnologias Utilizadas

- Nest.js
- TypeScript
- TypeORM
- PostgreSQL
- Redis
- Swagger
- Docker

## Requisitos

- Docker e Docker Compose instalados

## Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/este-repositorio.git
cd este-repositorio
```

### 2. Criar o arquivo .env

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

```bash
  DATABASE_HOST=db
  DATABASE_PORT=5432
  DATABASE_USERNAME=postgres
  DATABASE_PASSWORD=postgres
  DATABASE_NAME=moviesdb
  REDIS_HOST=redis
  REDIS_PORT=6379
  JWT_SECRET=your-secret-key
```

### 3. Construir e rodar os containers

docker-compose up --build

### 4. Acessar a aplicação

A aplicação estará disponível em http://localhost:3000. A documentação Swagger estará disponível em http://localhost:3000/api.

## Endpoints

## Autenticação

- POST /auth/login: Realiza o login e retorna um token JWT.

## Filmes

- GET /movies: Retorna todos os filmes (requer autenticação).
- GET /movies/:id: Retorna um filme específico por ID (requer autenticação).
- POST /movies: Cria um novo filme (requer autenticação).
- PUT /movies/:id: Atualiza um filme existente por ID (requer autenticação).
- DELETE /movies/:id: Deleta um filme por ID (requer autenticação).
