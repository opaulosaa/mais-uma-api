# Atividade Bootcamp Avanti

API REST para uma plataforma de compartilhamento de conhecimentos, onde usuários podem se cadastrar e publicar ofertas de habilidades ou saberes que desejam compartilhar com outros.

## O que a aplicação faz

- Permite o **cadastro e autenticação** de usuários com senha criptografada e token JWT
- Permite que usuários autenticados **publiquem, editem e removam** ofertas de conhecimento (ex: "Ensino violão", "Aulas de Python")
- Qualquer pessoa pode **listar e filtrar** as ofertas disponíveis, sem precisar de login
- Possui controle de permissões: somente o dono de uma oferta (ou um **ADMIN**) pode editá-la ou removê-la

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework para construção da API
- **PostgreSQL** — banco de dados relacional
- **Prisma** — ORM para interagir com o banco de dados
- **bcryptjs** — criptografia de senhas
- **jsonwebtoken (JWT)** — autenticação via token
- **dotenv** — gerenciamento de variáveis de ambiente
- **nodemon** — reinicialização automática em desenvolvimento

---

## Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 14 ou superior)
- [Git](https://git-scm.com/) (para clonar o repositório)

---

## Instalação e configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd mais-uma-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"
JWT_SECRET="uma_chave_secreta_qualquer"
```

Substitua os valores:
- `USUARIO` — seu usuário do PostgreSQL (padrão: `postgres`)
- `SENHA` — sua senha do PostgreSQL
- `NOME_DO_BANCO` — nome do banco de dados que você criou (ex: `mais-uma-api`)
- `JWT_SECRET` — pode ser qualquer texto longo e difícil de adivinhar (ex: `minha-chave-super-secreta-123`)

### 4. Execute as migrações do banco de dados

Este comando cria todas as tabelas necessárias no banco:

```bash
npx prisma migrate deploy
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|:---:|
| POST | `/pessoas` | Cadastrar novo usuário | Não |
| POST | `/login` | Fazer login e obter token | Não |

### Conhecimentos

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|:---:|
| GET | `/conhecimentos` | Listar todas as ofertas | Não |
| POST | `/conhecimentos` | Criar nova oferta | Sim |
| PUT | `/conhecimentos/:id` | Atualizar uma oferta | Sim |
| DELETE | `/conhecimentos/:id` | Remover uma oferta | Sim |

---

## Como usar a API

Você pode testar os endpoints utilizando ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).

### 1. Cadastrar um usuário

**POST** `http://localhost:3000/pessoas`

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "telefone": "11999999999",
  "descricao": "Desenvolvedor e entusiasta de tecnologia"
}
```

### 2. Fazer login

**POST** `http://localhost:3000/login`

```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

A resposta incluirá um `token`. Guarde-o — você precisará dele para as rotas autenticadas.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cargo": "USER"
}
```

### 3. Criar uma oferta de conhecimento

**POST** `http://localhost:3000/conhecimentos`

Adicione o token no cabeçalho da requisição:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

Corpo da requisição:
```json
{
  "titulo": "Aulas de Violão",
  "descricao": "Ensino violão para iniciantes e intermediários",
  "categoria": "Música",
  "nivel": "Iniciante"
}
```

### 4. Listar ofertas (com filtros opcionais)

**GET** `http://localhost:3000/conhecimentos`

Você pode filtrar por categoria e/ou nível usando query parameters:

```
GET http://localhost:3000/conhecimentos?categoria=Música
GET http://localhost:3000/conhecimentos?nivel=Iniciante
GET http://localhost:3000/conhecimentos?categoria=Música&nivel=Iniciante
```

### 5. Atualizar uma oferta

**PUT** `http://localhost:3000/conhecimentos/:id`

Substitua `:id` pelo ID da oferta. Requer token no cabeçalho.

```json
{
  "titulo": "Aulas de Violão e Guitarra",
  "nivel": "Intermediário"
}
```

### 6. Remover uma oferta

**DELETE** `http://localhost:3000/conhecimentos/:id`

Substitua `:id` pelo ID da oferta. Requer token no cabeçalho. Somente o dono da oferta ou um ADMIN pode removê-la.

---

## Estrutura do projeto

```
mais-uma-api/
├── prisma/
│   ├── schema.prisma        # Definição dos modelos do banco de dados
│   └── migrations/          # Histórico de migrações do banco
├── src/
│   ├── server.js            # Ponto de entrada — rotas e inicialização do servidor
│   ├── database.js          # Configuração do cliente Prisma
│   ├── controllers/
│   │   ├── pessoaController.js       # Lógica HTTP de usuários
│   │   └── conhecimentoController.js # Lógica HTTP de conhecimentos
│   ├── services/
│   │   ├── pessoaService.js          # Regras de negócio de usuários
│   │   └── conhecimentoService.js    # Regras de negócio de conhecimentos
│   └── middlewares/
│       └── auth.js          # Verificação de token JWT
├── .env                     # Variáveis de ambiente (não versionar!)
├── package.json
└── prisma.config.ts
```

---

## Observações importantes

- O arquivo `.env` **não deve ser enviado para o GitHub**. Adicione-o ao `.gitignore` se necessário.
- O cargo padrão de um usuário ao se cadastrar é `USER`. O cargo `ADMIN` deve ser definido diretamente no banco de dados.
- O token JWT expira em **1 dia**. Após isso, será necessário fazer login novamente.
