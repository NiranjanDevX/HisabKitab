# HisabKitab Frontend

Modern, responsive web application for HisabKitab, built with **Next.js 14** (App Router).

## 🌟 Features
-   **Dashboard**: Real-time financial overview with charts (Recharts).
-   **Expense Tracking**: Add, edit, filter, and export expenses.
-   **Scan Receipt**: Upload receipt images to auto-extract details (OCR).
-   **Financial Goals**: Set and track savings targets visually.
-   **AI Chat**: Interactive financial assistant with memory.
-   **Authentication**: Secure login via Firebase.
-   **Error Tracking**: Integrated with Sentry.

## 🛠 Tech Stack
-   **Framework**: Next.js 14
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + Shadcn UI
-   **State**: React Context
-   **Animations**: Framer Motion
-   **Charts**: Recharts

## 🚀 Getting Started

1.  **Navigate to directory**
    ```bash
    cd frontend
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and configure:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_SENTRY_DSN=...
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.

## 🧪 Error Reporting
This project uses **Sentry** for error tracking. Ensure `NEXT_PUBLIC_SENTRY_DSN` is set in your environment variables to enable crash reporting.

## 📂 Project Structure
-   `/src/app`: Page routes (Expenses, Goals, Dashboard).
-   `/src/components`: Reusable UI components.
-   `/src/lib`: Utilities and API client.
