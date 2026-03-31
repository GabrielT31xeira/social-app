# Social App

## PT-BR

### Requisitos

- Docker instalado
- Backend da API rodando e acessivel

### Configuracao

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

3. Ajuste `VITE_API_BASE_URL` se necessario.

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:84/api
VITE_LARAVEL_CSRF_ENABLED=true
# VITE_LARAVEL_CSRF_URL=http://localhost:84/sanctum/csrf-cookie
```

Importante:

- Essas variaveis sao usadas no momento do `docker build`.
- Se voce alterar a URL da API, precisa gerar a imagem novamente.
- Para backends Laravel, o frontend tenta buscar o cookie CSRF antes de refazer requisicoes que falhem com `419` ou `CSRF token mismatch`.
- Use `VITE_LARAVEL_CSRF_URL` apenas se o endpoint `/sanctum/csrf-cookie` estiver em uma URL diferente do host da API.

### Build da imagem

```bash
docker build -t social-app .
```

### Rodar o container

```bash
docker run --rm -p 3000:3000 --name social-app social-app
```

### Acessar a aplicacao

Abra no navegador:

```text
http://localhost:3000
```

### Parar o container

```bash
docker stop social-app
```

### Observacoes

- A imagem usa o `Dockerfile` da raiz do projeto.
- O container expoe a aplicacao na porta `3000`.
- O backend precisa aceitar requisicoes do frontend na URL configurada em `VITE_API_BASE_URL`.
- Em integracoes com Laravel, o backend tambem precisa liberar credenciais no CORS e configurar `SESSION_DOMAIN` e `SANCTUM_STATEFUL_DOMAINS`.

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
VITE_LARAVEL_CSRF_ENABLED=true
# VITE_LARAVEL_CSRF_URL=http://localhost:84/sanctum/csrf-cookie
```

Important:

- These variables are read during `docker build`.
- If you change the API URL, you must rebuild the image.
- For Laravel backends, the frontend will fetch the CSRF cookie before retrying requests that fail with `419` or `CSRF token mismatch`.
- Use `VITE_LARAVEL_CSRF_URL` only when `/sanctum/csrf-cookie` is exposed from a different URL than the API host.

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
- For Laravel integrations, the backend must also allow credentials in CORS and configure `SESSION_DOMAIN` and `SANCTUM_STATEFUL_DOMAINS`.
