# Contributing to Smart Disaster Knowledge Repository

Thank you for your interest in contributing! This guide will help you get set up and submit changes.

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/Kepler422b/SDK-REPO.git
cd SDK-REPO
```

### 2. Install dependencies

**Backend:**
```bash
cd smart-disaster-repo/backend
npm install
cp .env.example .env
# Fill in your credentials in .env
npm run dev
```

**Frontend:**
```bash
cd smart-disaster-repo/frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### 3. Create a branch

```bash
git checkout -b feat/your-feature-name
```

Use a descriptive branch name:
- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation only
- `refactor/` — code changes without new features
- `test/` — adding or updating tests

## Making Changes

- Keep commits **small and focused** — one logical change per commit.
- Write clear commit messages:
  - `feat: add loading state to search page`
  - `fix: validate required fields on upload`
  - `docs: update API endpoint table`
- Match the existing code style (ES modules, async/await, Tailwind on frontend).
- Do **not** commit secrets — `.env`, Firebase keys, or API keys.

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Describe what you changed and why.
4. Link any related issues if applicable.

## What to Work On

Good first contributions:
- Documentation improvements
- UI/UX polish (loading states, empty states, error messages)
- Input validation on forms and API routes
- Tests for API endpoints
- Accessibility improvements

## Questions?

Open an issue on GitHub if you get stuck or want to discuss an idea before coding.
