# Barber Shop - Sistema de Agendamento

Sistema completo de agendamento para barbearia em monorepo com Node.js, React e PostgreSQL.

## Stack

- **Monorepo**: npm workspaces
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT, Zod
- **Frontend**: React, Vite, TypeScript, TailwindCSS, React Query, React Hook Form
- **Banco de Dados**: PostgreSQL 16 via Docker
- **Tipos Compartilhados**: pacote `@barber-shop/shared`

## Estrutura

```
barber-shop/
├── packages/
│   ├── backend/          # API REST (porta 3001)
│   ├── frontend/         # SPA React (porta 5173)
│   └── shared/           # Tipos TypeScript compartilhados
├── docker-compose.yml
├── package.json
└── .env.example
```

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm 8+

## Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o banco de dados

```bash
docker-compose up -d
```

Aguarde alguns segundos para o PostgreSQL inicializar.

### 3. Executar migrations

```bash
npm run db:migrate
```

### 4. Popular banco com dados de exemplo

```bash
npm run db:seed
```

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

## URLs de Acesso

| Serviço  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:3001      |
| pgAdmin  | http://localhost:5050      |

## Credenciais de Teste

| Tipo    | Email                      | Senha     |
|---------|----------------------------|-----------|
| Admin   | admin@barbearia.com        | admin123  |
| Barbeiro | joao@barbearia.com        | barber123 |
| Barbeiro | pedro@barbearia.com       | barber123 |
| Cliente  | carlos@email.com          | client123 |

### pgAdmin
- Email: admin@barber.com
- Senha: admin123

## API Endpoints

### Autenticação
- `POST /api/auth/register` — Cadastrar
- `POST /api/auth/login` — Fazer login
- `GET /api/auth/me` — Usuário atual (requer token)

### Serviços
- `GET /api/services` — Listar serviços
- `POST /api/services` — Criar serviço (ADMIN)
- `PUT /api/services/:id` — Atualizar serviço (ADMIN)
- `DELETE /api/services/:id` — Deletar serviço (ADMIN)

### Barbeiros
- `GET /api/barbers` — Listar barbeiros
- `GET /api/barbers/:id` — Detalhes do barbeiro
- `GET /api/barbers/:id/availability?date=YYYY-MM-DD&serviceId=...` — Slots disponíveis
- `POST /api/barbers/:id/availability` — Configurar disponibilidade (ADMIN/BARBER)

### Agendamentos
- `GET /api/appointments` — Listar agendamentos do usuário
- `POST /api/appointments` — Criar agendamento
- `PATCH /api/appointments/:id/status` — Atualizar status
- `DELETE /api/appointments/:id` — Deletar agendamento

## Regras de Negócio

1. Não é permitido agendar em horários já ocupados
2. Não é permitido agendar fora da disponibilidade do barbeiro
3. Não é permitido agendar datas passadas
4. Clientes só podem cancelar agendamentos PENDING ou CONFIRMED
5. JWT expira em 7 dias

## Scripts Disponíveis

```bash
npm run dev          # Inicia backend + frontend em paralelo
npm run build        # Build de todos os pacotes
npm run db:migrate   # Executa migrations do Prisma
npm run db:seed      # Popula o banco com dados de exemplo
npm run db:studio    # Abre o Prisma Studio (GUI do banco)
```
