# Task: Setup Steps

Complete development environment setup.

---

## Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **npm 9+ or pnpm 8+**
   ```bash
   npm --version   # Should be 9.0.0 or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone [repository-url]
cd vibe-trading
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run Development Server

```bash
npx nx serve preview
```

### 4. Access Application

Open browser: **http://localhost:4300**

---

## Verification

✅ **Setup Complete:**
- [ ] Dependencies installed (no errors)
- [ ] Dev server starts successfully
- [ ] /preview route accessible
- [ ] 31 sector tiles render correctly
- [ ] No console errors

---

## Troubleshooting

**Port 4300 in use:**
```bash
npx nx serve preview --port=3000
```

**Dependencies won't install:**
```bash
rm -rf node_modules package-lock.json
npm install
```
