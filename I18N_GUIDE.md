# Internacionalização (i18n) - Guia de Uso

## Como Funciona

O projeto agora suporta múltiplos idiomas usando `react-i18next`. Atualmente estão disponíveis:
- **Português (Brasil)** - `pt-BR`
- **Inglês** - `en`

## Estrutura de Arquivos

```
app/
├── i18n/
│   └── config.ts           # Configuração do i18next
├── locales/
│   ├── pt-br.json         # Traduções em português
│   └── en.json            # Traduções em inglês
└── components/
    └── LanguageSwitcher.tsx # Componente para trocar idioma
```

## Como Usar em um Componente

### Importar o hook
```tsx
import { useTranslation } from 'react-i18next';
```

### Usar no componente
```tsx
export function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('info.title')}</h1>
      <p>Idioma atual: {i18n.language}</p>
    </div>
  );
}
```

## Como Adicionar Novas Traduções

### 1. Adicionar a chave em `locales/pt-br.json`
```json
{
  "info": {
    "title": "Sobre Mim",
    "newField": "Novo campo em português"
  }
}
```

### 2. Adicionar a chave em `locales/en.json`
```json
{
  "info": {
    "title": "About Me",
    "newField": "New field in English"
  }
}
```

### 3. Usar no componente
```tsx
const { t } = useTranslation();
return <p>{t('info.newField')}</p>;
```

## Como Adicionar um Novo Idioma

### 1. Criar arquivo de tradução
Crie `locales/es.json` (para espanhol, por exemplo):
```json
{
  "info": {
    "title": "Acerca de Mí",
    "name": "Gabriel Teixeira de Carvalho"
  }
}
```

### 2. Adicionar ao config
Edite `i18n/config.ts`:
```tsx
import es from '../locales/es.json';

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
  es: { translation: es },  // Novo idioma
};
```

### 3. Atualizar o seletor (opcional)
Edite `components/LanguageSwitcher.tsx` para adicionar a nova opção.

## Persistência de Idioma

O idioma selecionado é salvo no `localStorage` e restaurado quando o usuário retorna à página.

```tsx
// O idioma é armazenado automaticamente
i18n.changeLanguage('en');
localStorage.setItem('language', 'en');
```

## Componentes com i18n

### LanguageSwitcher
Componente de toggle para trocar entre idiomas:
```tsx
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export function Info() {
  return (
    <div>
      <LanguageSwitcher />
      {/* resto do conteúdo */}
    </div>
  );
}
```

## Variáveis em Traduções

Se precisar inserir valores dinâmicos nas traduções:

```json
{
  "message": "Olá, {{name}}!"
}
```

No componente:
```tsx
const { t } = useTranslation();
return <p>{t('message', { name: 'Gabriel' })}</p>;
// Output: "Olá, Gabriel!"
```

## Exemplo com React Elements

Para incluir elementos React (como links) nas traduções, use:

```tsx
const { t } = useTranslation();

return (
  <p>
    {t('info.notice.description', {
      link: (
        <a href="https://jsonplaceholder.typicode.com/">
          {t('info.notice.linkText')}
        </a>
      ),
    })}
  </p>
);
```

E na tradução use `{{link}}`:
```json
{
  "description": "Use {{link}} para aprender mais."
}
```

---

Pronto! Seu projeto agora suporta múltiplos idiomas! 🌍
