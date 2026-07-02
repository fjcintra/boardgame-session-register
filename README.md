# DiceLog - Registro de Partidas de Board Games

O **DiceLog** é uma aplicação web completa desenvolvida para entusiastas de jogos de tabuleiro. Ele serve para gerenciar sua coleção pessoal de jogos, registrar sessões de partidas com amigos (vencedores, tempo de jogo, regras da casa, quantidade de jogadores) e manter o perfil do usuário atualizado.

---

## 🚀 Funcionalidades

- **Autenticação Segura (JWT)**: Login e cadastro integrados com criptografia de senhas no backend.
- **Coleção de Jogos (CRUD)**:
  - Adição de novos jogos informando título, descrição e limite de jogadores (mínimo/máximo).
  - Listagem com ordenação dinâmica (por nome, data de adição ou popularidade/mais jogados).
  - Remoção de jogos e cascateamento das partidas associadas.
- **Histórico de Partidas**:
  - Registro de sessões detalhadas diretamente do card do jogo ou de um formulário geral.
  - Filtro avançado por múltiplos jogos simultaneamente.
  - Ordenação por data de partida, vencedor, tempo de jogo e quantidade de jogadores.
  - Exclusão de partidas.
- **Perfil do Usuário**: Consulta e atualização de informações pessoais e endereço diretamente no banco de dados.
- **Segurança & Configurações**: Módulo para alteração rápida de senha do usuário.

---

## 🛠️ Stack Tecnológica

- **Backend**: Python, FastAPI, SQLAlchemy (Async/aiosqlite), Pydantic.
- **Frontend**: React.js (v19), TypeScript, Vite (v8), Vanilla CSS.
- **Banco de Dados**: SQLite para desenvolvimento local (configurado com suporte a PostgreSQL para produção).
- **Testes**: Pytest (com pytest-asyncio e httpx).

---

## 📦 Estrutura do Repositório

```text
boardgame-session-register-system/
├── backend/                  # Código FastAPI (Backend)
│   ├── app/
│   │   ├── api/              # Rotas REST (/auth, /users, /games, /matches)
│   │   ├── core/             # Segurança, Criptografia e JWT
│   │   ├── models/           # Tabelas SQLAlchemy
│   │   ├── schemas/          # Schemas de Validação Pydantic
│   │   └── database.py       # Configuração da conexão assíncrona com DB
│   └── tests/                # Testes Unitários e de Integração
└── frontend/                 # Código React (Frontend)
    ├── src/
    │   ├── components/       # Componentes de UI (Views e Modais)
    │   ├── utils/            # Cliente HTTP genérico (fetch api wrapper)
    │   └── App.tsx           # Ponto de entrada de estados e navegação
```

---

## 🔧 Instalação e Execução

### 1. Requisitos Prévios
- Python 3.12 ou superior instalado.
- Node.js 18 ou superior instalado.

### 2. Configurando o Backend

1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # No Windows use: .venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure as variáveis de ambiente em um arquivo `.env` dentro de `/backend`:
   ```env
   DATABASE_URL=sqlite+aiosqlite:///./boardgame_tracker.db
   SECRET_KEY=8f9c1b6ad72ea594191fe427cf63a1523ad6f73db1c52b7beea8909de198c60f
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]
   ```
5. Inicie o servidor:
   ```bash
   uvicorn app.main:app --reload
   ```
   *O backend estará rodando em [http://localhost:8000](http://localhost:8000).*
   *Você pode acessar a documentação OpenAPI gerada automaticamente em [http://localhost:8000/docs](http://localhost:8000/docs).*

### 3. Executando os Testes do Backend
Para garantir que as APIs estão funcionando perfeitamente, execute na raiz da pasta `backend`:
```bash
PYTHONPATH=. .venv/bin/pytest
```

---

### 4. Configurando o Frontend

1. Entre na pasta `frontend`:
   ```bash
   cd ../frontend
   ```
2. Instale os pacotes npm:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` dentro da pasta `/frontend` e adicione a URL da API do backend:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *O frontend estará acessível em [http://localhost:5173](http://localhost:5173).*

---

## 🗺️ Progresso do Projeto

Para conferir o mapa detalhado de progresso, arquivos-chave do sistema e próximos marcos planejados, acesse o arquivo de acompanhamento do ciclo de vida: [CONTEXT.md](file:///home/fabio/Projetos/boardgame-session-register-system/CONTEXT.md).
