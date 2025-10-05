# 🚀 Project QOL Frontend

The frontend application for **Project QOL** (Quality of Life), a software development initiative aimed at enhancing the developer experience and overall quality of life for our team.

This project is a modern web application built with **Next.js** and bootstrapped using `create-next-app`.

## ✨ Key Features

* **Modern Stack**: Built with Next.js (React) and TypeScript for a robust and scalable application.
* **Optimized Performance**: Leverages Next.js features like automatic code splitting and Vercel's optimized font loading (Geist).
* **Intuitive Routing**: Uses the modern Next.js **App Router** for clear and organized page structure and routing logic.
* **Reusable Components**: Standardized UI components for rapid development and consistency.

---

## 🏗️ Project Structure

The repository is organized to maintain clarity and separation of concerns, following standard Next.js conventions.

| Directory | Purpose |
| :--- | :--- |
| **`app/`** | Contains the **routing logic** for the application (the App Router). This is where you define your pages, layouts, and their respective routes. |
| **`components/`** | Houses **reusable UI components** (e.g., buttons, cards, navigation) that are used throughout the application. |
| **`hooks/`** | Stores **custom React Hooks** for encapsulating stateful logic and making it reusable across different components. |
| **`libs/`** | Intended for **utility functions**, helper libraries, constant data, and non-React specific logic. |
| **`public/`** | For static assets like images, fonts, and other files that need to be served directly. |

---

## 🛠️ Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

* Node.js (LTS recommended)
* A package manager (npm, yarn, pnpm, or bun)

### Installation

1.  **Clone the Repository:**

    ```bash
    git clone [YOUR_REPO_URL_HERE]
    cd project-qol-frontend
    ```

2.  **Install Dependencies:**

    Choose your preferred package manager:

    ```bash
    # Using npm
    npm install
    
    # or using yarn
    # yarn install
    
    # or using pnpm
    # pnpm install
    ```

### Running the Development Server

Start the development server with hot-reloading:

```bash
# Using npm
npm run dev

# or using yarn
# yarn dev

# or using pnpm
# pnpm dev

# or using bun
# bun dev
```

Open your browser and navigate to http://localhost:3000 to see the result.

Tip: Start editing the main page by modifying app/page.tsx. The page will auto-update as you make changes.

📚 Learn More
To learn more about Next.js features and concepts, check out the following resources:

Next.js Documentation - Learn about Next.js features and API.

Learn Next.js - An interactive Next.js tutorial.

🚢 Deployment
The easiest and most efficient way to deploy your Next.js app is to use the Vercel Platform, developed by the creators of Next.js.

Simply push your code to GitHub, and link your repository to a new Vercel project. Vercel handles the build process, optimization, and global delivery automatically.

For detailed instructions, refer to the Next.js Deployment Documentation.
