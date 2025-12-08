
# 📚 VanDerLer – Frontend

> Uma biblioteca digital moderna, acessível e estilosa, feita para facilitar o acesso à leitura e gestão de livros.  
> Frontend em **React + Vite**, integrado ao back-end em Java/Spring Boot.

---

## 🧭 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Rodando o Projeto Localmente](#-rodando-o-projeto-localmente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Configuração de Ambiente (.env)](#-configuração-de-ambiente-env)
- [Integração com Reconhecimento Facial (Azure)](#-integração-com-reconhecimento-facial-azure)
- [Fluxo de Navegação](#-fluxo-de-navegação)
- [Padrões de Código](#-padrões-de-código)
- [Boas Práticas de Commits e Branches](#-boas-práticas-de-commits-e-branches)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Licença](#-licença)

---

## 🔍 Visão Geral

O **VanDerLer** é uma plataforma de biblioteca online onde usuários podem:

- Explorar um catálogo de livros;
- Ver detalhes de cada obra;
- Criar conta, fazer login e gerenciar perfil;
- Evoluir para fluxos avançados como autenticação por reconhecimento facial.

Este repositório é **exclusivamente o frontend** da aplicação, construído com:

- **React 19** + **Vite**
- Integração com API REST via **Axios**
- Navegação cliente-side com **React Router DOM**

---

## ✨ Funcionalidades

Funcionalidades atuais / planejadas no frontend:

- 🔐 **Autenticação de Usuário**
  - Login
  - Cadastro
  - Redirecionamento pós-login

- 🧑‍💻 **Gerenciamento de Perfil**
  - Tela de perfil do usuário (`/profile`)
  - Exibição de dados básicos
  - Ajustes visuais com base em contexto de usuário

- 📖 **Gestão de Livros**
  - Listagem de livros na Home
  - Tela de detalhes do livro (`/books/:id`)
  - Exibição de título, autor, descrição e demais metadados

- 🧬 **Reconhecimento Facial (Fluxo de UI)**
  - Tela de cadastro de face (`/face-registration`)
  - Tela de verificação de face (`/face-verification`)
  - Integração planejada com serviços de reconhecimento facial no back-end

- 💅 **UI/UX**
  - Layout responsivo
  - Componentização organizada
  - Ícones com `react-icons`

> OBS: Algumas funcionalidades podem estar em desenvolvimento dependendo da branch utilizada.

---

## 🧱 Stack Tecnológica

**Linguagem & Frameworks**

- [x] [React 19](https://react.dev/)
- [x] [Vite](https://vitejs.dev/) (build + dev server)
- [x] [React Router DOM 7](https://reactrouter.com/)
- [x] [Axios](https://axios-http.com/) – chamadas HTTP

**Ferramentas de Qualidade**

- [x] ESLint (`eslint`, `@eslint/js`)
- [x] Plugins React (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

**Outras**

- [x] `prop-types`
- [x] `react-icons`

---

## 🗂 Arquitetura do Projeto

Estrutura sugerida (pode adaptar conforme o repo real):

```bash
vanderler-frontend/
├─ public/
│  └─ favicon.ico
├─ src/
│  ├─ assets/
│  │  ├─ images/
│  │  └─ svg/
│  ├─ components/
│  │  ├─ Navbar/
│  │  ├─ Footer/
│  │  ├─ BookCard/
│  │  └─ commons/
│  ├─ pages/
│  │  ├─ Home/
│  │  │  └─ Home.jsx
│  │  ├─ Login/
│  │  │  └─ Login.jsx
│  │  ├─ Register/
│  │  │  └─ Register.jsx
│  │  ├─ BookDetails/
│  │  │  └─ BookDetails.jsx
│  │  ├─ FaceRegistration/
│  │  │  └─ FaceRegistration.jsx
│  │  ├─ FaceVerification/
│  │  │  └─ FaceVerification.jsx
│  │  └─ Profile/
│  │     └─ Profile.jsx
│  ├─ services/
│  │  ├─ api.js          # Instância base do Axios
│  │  └─ bookService.js  # Exemplo de serviço para livros
│  ├─ contexts/
│  │  └─ AuthContext.jsx
│  ├─ hooks/
│  │  └─ useAuth.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles/
│     └─ global.css
├─ .eslintrc.cjs
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## 🧰 Rodando o Projeto Localmente

### ✅ Pré-requisitos

- **Node.js** (versão LTS recomendada – 18+)
- **npm** ou **yarn**

Verifique as versões instaladas:

```bash
node -v
npm -v
```

---

### 📥 Clonar o Repositório

```bash
git clone https://github.com/VanDerLer/Frontend.git
cd Frontend
```

---

### 📦 Instalar Dependências

Usando `npm`:

```bash
npm install
```

ou com `yarn`:

```bash
yarn
```

---

### 🚀 Rodar em Ambiente de Desenvolvimento

```bash
npm run dev
```

Por padrão, o Vite sobe em algo como:

- http://localhost:5173

O terminal mostrará a URL exata.

---

### 🏗 Gerar Build de Produção

```bash
npm run build
```

O build final será gerado na pasta `dist/`.

Para pré-visualizar o build:

```bash
npm run preview
```

---

## 📜 Scripts Disponíveis

Definidos em `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- `npm run dev` → Sobe o projeto em modo desenvolvimento.
- `npm run build` → Gera o bundle de produção.
- `npm run preview` → Serve o build gerado para testes locais.
- `npm run lint` → Roda o ESLint para análise estática do código.

---

## 🔐 Configuração de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto (mesmo nível do `package.json`):

```env
VITE_API_BASE_URL=https://seu-backend-vanderler.com/api
VITE_ENVIRONMENT=development
```

Exemplo de uso no código:

```js
// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

> Nunca commitar `.env` no repositório. Adicione ao `.gitignore` se ainda não estiver.

---

## ⚠️ Integração com Reconhecimento Facial (Azure)

A validação facial no **back-end** usa um serviço de reconhecimento facial baseado na Azure. Porém, **a camada gratuita da Azure é limitada (em torno de 7 dias)**.  
Por isso, é importante entender o seguinte comportamento:

- O *service* no back-end **tenta validar a foto na Azure**;
- Se a Azure responder normalmente com um booleano (sim/não), a regra de validação é aplicada;
- **Caso a Azure pare de responder corretamente** (por exemplo, a chave expirada, limite gratuito excedido ou resposta vazia),
  o serviço de back-end entende que **a Azure não está funcionando** e:
  - passa a **aceitar qualquer foto**;
  - o fluxo de validação facial vira **apenas uma simulação**, para não travar os testes da aplicação.

> Em resumo: dependendo da data em que você estiver rodando o sistema, a validação facial pode **não estar de fato validando** a face, apenas simulando sucesso.

### ✅ Como ativar a validação real novamente

Se você quiser que a validação funcione de verdade:

1. Gere/atualize uma **nova key da Azure Face API**;
2. Acesse o back-end do VanDerLer;
3. Atualize a configuração da chave no arquivo `application.properties` (ou `application.yml`, dependendo do projeto), nos campos relacionados à Azure;
4. Reinicie o back-end.

A partir daí, se a Azure estiver ativa, o service volta a receber respostas válidas e a **validar as fotos de forma real**, e não apenas em modo simulação.

---

## 🧭 Fluxo de Navegação

Rotas principais (conforme `App.jsx`):

- `/` → **Home** – listagem inicial de livros.
- `/login` → **Login** de usuário.
- `/register` → **Cadastro**.
- `/books/:id` → **Detalhes do livro** selecionado.
- `/profile` → **Perfil do usuário**.
- `/face-registration` → **Cadastro de face** (UI para integração com back-end).
- `/face-verification` → **Verificação de face**.

A navegação é feita com `react-router-dom`.

---

## 🧹 Padrões de Código

**Estilo & Organização**

- Componentes com `PascalCase`: `BookCard.jsx`, `Navbar.jsx`
- Hooks com `camelCase` começando com `use`: `useAuth`, `useBooks`
- Imports organizados de forma crescente: libs, contextos, serviços, componentes, estilos.

**PropTypes**

- Utilize `prop-types` para tipar as props dos componentes:

```js
import PropTypes from "prop-types";

function BookCard({ title, author }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  );
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};
```

**Lint**

- Antes de abrir PR, rode:

```bash
npm run lint
```

---

## 🌿 Boas Práticas de Commits e Branches

Sugestão de fluxo (pode ser adaptado à realidade do time):

### Branches

- `main` → branch estável / produção
- `dev-nicolas`, `dev-<nome>` → branches de desenvolvimento
- `feature/<nome-feature>` → novas funcionalidades
- `fix/<nome-bug>` → correções

### Commits

Use mensagens descritivas e padronizadas:

- `feat: adiciona tela de detalhes do livro`
- `fix: corrige redirecionamento após login`
- `refactor: organiza serviços de API`
- `style: ajusta espaçamentos na Home`
- `docs: atualiza README`

---

## 🛣 Roadmap

Algumas ideias de evolução para o frontend do VanDerLer:

- [ ] Melhorar responsividade em telas muito pequenas e muito grandes.
- [ ] Implementar skeleton/loading states nas páginas de livros.
- [ ] Adicionar sistema de favoritos / estante do usuário.
- [ ] Tela de listagem por categoria / gênero.
- [ ] Integração completa com o fluxo de reconhecimento facial do back-end.
- [ ] Tela de administração para gestão de livros (CRUD).
- [ ] Internacionalização (i18n) – PT-BR / EN.

---

## ❓ FAQ

**1. O projeto funciona sem o back-end rodando?**  
Parcialmente. A UI sobe, mas listagem de livros, login e etc dependem da API configurada em `VITE_API_BASE_URL`.

**2. Posso usar outro gerenciador de pacotes?**  
Sim. O projeto funciona tanto com `npm` quanto com `yarn` ou `pnpm`. Só não misture.

**3. Onde configuro a URL do back-end?**  
No arquivo `.env`, via `VITE_API_BASE_URL`.

**4. Dá pra rodar em container Docker?**  
Sim. Gere o build com `npm run build` e sirva a pasta `dist` com Nginx, Apache ou outro servidor estático. A criação do Dockerfile fica a critério do time.

**5. A validação facial sempre funciona de forma real?**  
Não necessariamente. Se a Azure estiver fora, com key expirada ou limite gratuito estourado, o back-end entra em modo de simulação e **aceita qualquer foto**. Para validar de verdade, atualize a key da Azure no `application.properties`.

---

## 📜 Licença

Este projeto é de uso acadêmico e/ou interno da equipe **VanDerLer**.  
A licença pode ser ajustada conforme necessidade (MIT, Apache 2.0, etc).

---

> _“Ler transforma. Codar também.”_ 💜  
> _VanDerLer – uma biblioteca que cabe no seu navegador._
