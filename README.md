# G4 Task Manager - Frontend React

Interface web pour la gestion d'utilisateurs et de tâches, connectée à l'API REST PHP.

[![CI](https://github.com/Gectou4/rest_api_front_react/actions/workflows/ci.yml/badge.svg)](https://github.com/Gectou4/rest_api_front_react/actions/workflows/ci.yml)

> **Part of the G4Api series.** The same small API (users, tasks and their N:N link) built in several stacks, to compare ecosystems: language, tooling, tests, static analysis and CI. Learning project. The PHP version is the reference: written by hand, then polished with AI-assisted review. The other stacks were ported from it in May 2026 with the help of an AI coding assistant.
>
> | Stack                | Repository                                                                          |
> | -------------------- | ----------------------------------------------------------------------------------- |
> | PHP 8 (no framework) | [rest_api_php](https://github.com/Gectou4/rest_api_php)                             |
> | Go                   | [rest_api_go](https://github.com/Gectou4/rest_api_go)                               |
> | Rust (axum, sqlx)    | [rest_api_rs](https://github.com/Gectou4/rest_api_rs)                               |
> | Java 21 (Jersey)     | [rest_api_java](https://github.com/Gectou4/rest_api_java)                           |
> | .NET 8 (Dapper)      | [rest_api_netcsharp](https://github.com/Gectou4/rest_api_netcsharp)                 |
> | Python (Flask)       | [rest_api_python](https://github.com/Gectou4/rest_api_python)                       |
> | Node.js (Express)    | [rest_api_nodejs](https://github.com/Gectou4/rest_api_nodejs)                       |
> | React front-end      | [rest_api_front_react](https://github.com/Gectou4/rest_api_front_react) (this repo) |

## Stack

- **Vite** + **React 18**
- **react-router-dom** pour le routing
- **fetch natif** pour les appels API
- **CSS pur** avec variables CSS (design corporate)
- **Vitest** + **Testing Library** pour les tests
- **ESLint** + **Prettier** pour lint/format

## Prérequis

- Docker & Docker Compose
- **OU** Node.js 20+ et npm

## Via Docker (recommandé)

### Lancer l'application complète (front + back + db)

```bash
docker compose up -d
```

- Frontend : `http://localhost:5173`
- Backend API : `http://localhost:8080/public`

### Exécuter les commandes CI

```bash
# Build de l'image CI
docker compose build frontend-ci

# Lint
docker run --rm rest_api_front_react-frontend-ci npm run lint

# Format check
docker run --rm rest_api_front_react-frontend-ci npm run format:check

# Tests
docker run --rm rest_api_front_react-frontend-ci npm run test

# Build production
docker run --rm rest_api_front_react-frontend-ci npm run build
```

### Formater le code

```bash
docker run --rm -v "${PWD}:/app" -w /app rest_api_front_react-frontend-ci npx prettier --write src/
```

## Via Node.js local

### Installation

```bash
npm install
```

### Démarrage du backend

Le frontend nécessite que l'API PHP soit démarrée. Depuis le dossier `rest_api_php` :

```bash
cd ../rest_api_php
docker-compose up -d
```

### Développement

```bash
npm run dev
```

Le serveur Vite démarre sur `http://localhost:5173` et proxy les requêtes `/api/*` vers le backend PHP.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run test` | Exécution des tests |
| `npm run test:watch` | Tests en mode watch |
| `npm run lint` | Vérification ESLint |
| `npm run lint:fix` | Correction automatique ESLint |
| `npm run format` | Formatage avec Prettier |
| `npm run format:check` | Vérification du formatage |

## Structure

```
src/
├── api/           # Couche d'appels API
├── components/    # Composants UI réutilisables
├── hooks/         # Custom hooks
├── pages/         # Pages principales
├── App.jsx        # Configuration des routes
├── main.jsx       # Point d'entrée
└── index.css      # Styles CSS
```

## Endpoints utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/user/{id}` | Données d'un utilisateur |
| `GET` | `/user/{id}/task` | Tâches d'un utilisateur |
| `POST` | `/task` | Créer une tâche |
| `POST` | `/task/{id}` | Modifier une tâche |
| `DELETE` | `/task/{id}` | Supprimer une tâche |
| `POST` | `/user/{id}/task/{taskId}` | Associer une tâche |
| `DELETE` | `/user/{id}/task/{taskId}` | Retirer une tâche |

## CI

GitHub Actions exécute automatiquement sur push/PR :
- ESLint
- Prettier check
- Vitest
- Vite build
