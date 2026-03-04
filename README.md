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
   pip install -r requirements.txt
   ```
2. Configure o arquivo `.env` com sua chave de API(groq): 
   ```
   APIKey=suachaveaqui
   ```
3. Execute as migrações:
   ```bash
   python manage.py migrate
   ```
4. Inicie o servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
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

- As chaves de API nunca devem ser versionadas. Use sempre o arquivo `.env` e mantenha-o no `.gitignore`.
- Caso não tenha acesso a uma API paga de IA, é possível simular a resposta com um mock.
- O projeto está pronto para integração contínua (CI) e pode ser facilmente adaptado para outros bancos de dados.

---

## Licença

Este projeto é open-source e pode ser utilizado para fins educacionais.
