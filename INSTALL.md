# Install / Run Instructions

This file explains how to install and run the project when you have received the repository ZIP archive (e.g. `project-qol-frontend.zip`) produced by CI.

These instructions assume the ZIP contains the full project (source, `package.json`, `app`, `public`, etc.).

---

## 1 Extract the archive

### On Windows (PowerShell)

1. Create a folder and extract the ZIP:

```powershell
New-Item -ItemType Directory -Path .\project-install
Expand-Archive -Path .\project-<short-sha>.zip -DestinationPath .\project-install
Set-Location .\project-install
```

2. (Optional) If `tar` is included and the ZIP contains a `.tar` inside, extract it as well:

```powershell
# If project.dist or project-<sha>.tar.gz exists
if (Test-Path .\project.dist) { tar -xzf .\project.dist -C . } 
```

### On macOS / Linux

```bash
mkdir project-install
unzip project-<short-sha>.zip -d project-install
cd project-install
```


## 2 Install dependencies

This project uses npm. Ensure you have Node.js (v18+) and npm installed.

### Check Node & npm

```bash
node -v
npm -v
```

### Install

If a `package-lock.json` exists, use `npm ci` for reproducible installs:

```bash
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
```

On Windows PowerShell, run:

```powershell
if (Test-Path package-lock.json) { npm ci } else { npm install }
```


## 3 Build the project

This project uses Next.js. To build:

```bash
npm run build
```

If the build succeeds, you can run the built app locally with:

```bash
npm run start
```

Or run in development mode:

```bash
npm run dev
```


## 4 Notes and troubleshooting

- If you hit lint failures during CI or locally, run `npm run lint` and follow the reported fixes.
- If you need a production server, you may deploy the contents of `.next` and `public` according to your hosting provider's instructions.
- The ZIP excludes `node_modules` and `.git` by default to keep the archive small. Install dependencies as shown above.

---

If you want the installer to automatically run `npm ci` or `npm run build`, we can provide a small installer script (`install.sh` / `install.ps1`) and include it in the ZIP. Let me know if you want that and I will add it.