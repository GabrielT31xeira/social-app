# Social App

## PT-BR

### Requisitos

- Docker instalado
- Backend da API rodando e acessível

### Configuração

1. Crie um arquivo `.env` na raiz do projeto.
2. Use o `.env.example` como base:

Linux/macOS:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Ajuste a variável `VITE_API_BASE_URL` se necessário.

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:84/api
```

Importante:

- Essa variável é usada no momento do `docker build`.
- Se você alterar a URL da API, precisa gerar a imagem novamente.

### Build da imagem

```bash
docker build -t social-app .
```

### Rodar o container

```bash
docker run --rm -p 3000:3000 --name social-app social-app
```

### Acessar a aplicação

Abra no navegador:

```text
http://localhost:3000
```

### Parar o container

```bash
docker stop social-app
```

### Observações

- A imagem usa o `Dockerfile` da raiz do projeto.
- O container expõe a aplicação na porta `3000`.
- O backend precisa aceitar requisições do frontend na URL configurada em `VITE_API_BASE_URL`.

---

## English

### Requirements

- Docker installed
- The backend API running and reachable

### Setup

1. Create a `.env` file in the project root.
2. Use `.env.example` as the base file:

Linux/macOS:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `VITE_API_BASE_URL` if needed.

Example:

```env
VITE_API_BASE_URL=http://localhost:84/api
```

Important:

- This variable is read during `docker build`.
- If you change the API URL, you must rebuild the image.

### Build the image

```bash
docker build -t social-app .
```

### Run the container

```bash
docker run --rm -p 3000:3000 --name social-app social-app
```

### Open the application

Open this URL in your browser:

```text
http://localhost:3000
```

### Stop the container

```bash
docker stop social-app
```

### Notes

- The image uses the root `Dockerfile`.
- The container serves the app on port `3000`.
- The backend must accept requests from the frontend at the URL configured in `VITE_API_BASE_URL`.
