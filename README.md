# Hub Inteligente de Recursos Educacionais

## Descrição

Aplicação Fullstack para gerenciamento de materiais didáticos. Permite o cadastro, edição, exclusão e listagem de recursos educacionais, além de utilizar Inteligência Artificial para sugerir descrições e tags automaticamente, agilizando o trabalho dos conteudistas.

---

## Funcionalidades

- **CRUD de Recursos:**  
  - Listagem com paginação  
  - Cadastro, edição e exclusão  
  - Campos: Título, Descrição, Tipo (Vídeo, PDF, Link), Link/URL, Tags

- **Smart Assist (IA):**  
  - Botão "Gerar Descrição com IA" no formulário  
  - Sugestão automática de descrição e tags via API de LLM (Groq/OpenAI/Gemini)  
  - Preenchimento automático dos campos

- **SPA (Single Page Application):**  
  - Interface moderna e responsiva com React  
  - Feedback visual durante requisições à IA  
  - Tratamento de erros em todas as operações

- **Observabilidade:**  
  - Logs estruturados das interações com IA  
  - Endpoint de Health Check (`/api/health`)

---

## Tecnologias Utilizadas

- **Backend:**  
  - Python (Django + Django REST Framework)  
  - Pydantic para validação de dados  
  - Integração com API de LLM (Groq/OpenAI/Gemini)  
  - Banco de dados SQLite

- **Frontend:**  
  - React  
  - Axios para requisições HTTP

- **DevOps:**  
  - Variáveis de ambiente para segurança de chaves  
  - Estrutura pronta para CI/CD (GitHub Actions recomendado)

---

## Como Executar

### Backend

1. Instale as dependências:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure o arquivo `.env` (use `.env.example` como referência):
   ```bash
   cp .env.example .env
   ```
   Edite `.env` com suas credenciais:
   ```
   SecretKey=sua-chave-secreta
   Debug=True
   APIKey=sua-chave-groq-aqui
   ```

3. Execute as migrações:
   ```bash
   python manage.py migrate
   ```

4. Inicie o servidor:
   ```bash
   python manage.py runserver
   ```
   Backend estará em `http://localhost:8000`

### Frontend

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

2. (Opcional) Configure o arquivo `.env` se usar servidor backend diferente:
   ```bash
   cp .env.example .env.local
   ```
   Edite `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Frontend estará em `http://localhost:5173`

---

## Desenvolvimento & Qualidade

### Linting

Executar verificações de código:

```bash
# Backend
flake8 backend/ --max-line-length=120 --exclude=backend/venv,backend/migrations
black --check backend/

# Frontend
cd frontend
npm run lint
```

### Health Check

Verificar se o backend está rodando:
```bash
curl http://localhost:8000/api/health/
```

---

## Estrutura do Projeto

```
project/
  backend/
    core/
    resources/
  frontend/
    src/
      components/
      services/
```

---

## Observações

- **Segurança**: As chaves de API nunca devem ser versionadas. Use os arquivos `.env.example` como template e mantenha `.env` no `.gitignore`.
- **Configuração do Frontend**: Por padrão, a API base é `http://localhost:8000/api`. Use `.env.local` para sobrescrever durante desenvolvimento.
- **Timeout da IA**: O timeout está configurado com 5s para conexão e 30s para leitura, balanceando responsividade com tempo de processamento da IA.
- **Tratamento de Erros**: O backend fornece mensagens de erro específicas (timeout, rede, formato inválido) para melhor debugging.
- **Logging**: Logs estruturados das requisições à IA incluem token usage e latência em segundos.
- **CI/CD**: Pipeline GitHub Actions configurado com linting (flake8, black para Python; ESLint para JavaScript).
- **Banco de Dados**: Pronto para ser adaptado para PostgreSQL ou MySQL em produção.
- **Simulação**: Se não tiver acesso a API paga de IA, é possível simular a resposta com um mock.

---

## Licença

Este projeto é open-source e pode ser utilizado para fins educacionais.
