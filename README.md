# Intelli-PDF

### AI-Powered Document Understanding & Study Assistant

**Intelli-PDF** is a modern web application that transforms static PDF documents into an **interactive and intelligent learning experience**.  
Instead of passively reading long PDFs, users can **ask questions, understand concepts faster, and study smarter using AI**.

This project is designed with **real-world security, scalability, and usability** in mind.

---

## 🚀 Features

### 🔐 Secure Authentication
- Email & password signup
- OTP-based email verification
- Protected OTP flow (no direct URL access)
- Session-based authentication
- Middleware-secured routes

### 📂 PDF Handling
- Upload and manage PDF documents
- Secure server-side processing
- Optimized for academic and study use cases

### 🤖 AI-Powered Interaction
- Ask questions directly from PDF content
- Get contextual answers instead of keyword search
- Reduces reading time and improves understanding

### 🧠 Smart Learning Experience
- Faster revision for students
- Helpful for exams and concept clarification
- Converts PDFs into an interactive study assistant

---

## 🛡️ Security Highlights

- OTP expiration and rate limiting
- HTTP-only cookies for sensitive tokens
- Middleware-based route protection
- Flow-based verification (signup → OTP → access)
- Separation of authentication and verification logic

Built following **production-grade security practices**.

---

## 🧰 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI

### Backend
- Next.js API Routes
- MongoDB + Mongoose
- Redis (OTP)
- NextAuth (session management)

### AI
- AI integration for document-based question answering
- Architecture ready for future AI enhancements

---

## 📁 Project Structure
```
INTELLI-PDF/
├── .next/
├── app/
│ ├── api/
│ │ ├── auth/
│ │ ├── chat/
│ │ ├── embedding/
│ │ ├── flashcard/
│ │ ├── pdf/
│ │ ├── quiz/
│ │ └── summary/
│ │
│ ├── auth/
│ │ ├── forgot-password/
│ │ ├── login/
│ │ ├── otp/
│ │ ├── signout/
│ │ └── signup/
│ │
│ ├── chat/
│ ├── dashboard/
│ ├── history/
│ ├── pdf/
│ ├── settings/
│ │
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
│
├── components/
│ ├── pages/
│ │ ├── dashboard/
│ │ ├── home/
│ │ └── pdf/
│ ├── auth/
│ ├── common/
│ └── ui/
│
├── helpers/
├── hooks/
├── layout/
├── lib/
├── models/
├── providers/
├── public/
├── store/
├── styles/
├── types/
├── utils/
│
├── .env.local
├── .gitignore
├── components.json
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

### 🧠 Structure Overview

- **`app/`** – Application routes (App Router)
- **`app/api/`** – Backend APIs (Auth, Chat, PDF, AI features)
- **`components/`** – Reusable UI & feature components
- **`lib/`** – Database, Redis, OTP, and utility logic
- **`models/`** – MongoDB schemas
- **`middleware.ts`** – Route protection & OTP flow control
- **`utils/`, `helpers/`, `hooks/`** – Shared logic & helpers

---

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/M-Nowfal/intelli-pdf.git
cd intelli-pdf
npm install
```

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url

MONGO_URI=your_db_uri
DB_NAME=your_db_name

NEXTAUTH_URL=your_nextauth_url
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_clientid
GOOGLE_CLIENT_SECRET=your_google_client_secret

UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

SMTP_HOST=your_host_service
SMTP_PORT=your_port_no
SMTP_USER=your_email
SMTP_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_API_KEY=your_google_api_key
```

Run the app

```bash
npm run dev
```

🎯 Use Cases

 - Students studying from PDFs

 - Exam preparation and revision

 - Research paper understanding

 - Learning complex topics faster

🔮 Future Enhancements

 - PDF summarization

 - Flashcard generation

 - Quiz generation from documents

 - Chat history per document

👨‍💻 Author

 - Muhammed Nowfal and Sreedharan
 - B.Sc Computer Science
 - Passionate about Full Stack Development & AI-powered applications

⭐ Support

If you like this project, give it a ⭐ on GitHub and feel free to contribute!