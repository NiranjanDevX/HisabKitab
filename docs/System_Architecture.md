# 🏗️ System Architecture – HisabKitab

This document explains the high-level system architecture of **HisabKitab** so contributors and users can easily understand how the platform works.

---

## 🌐 High-Level Overview

HisabKitab is a **multi-platform system** consisting of:

- Web Application (Next.js)
- Mobile Application (Flutter)
- Backend API (FastAPI)
- AI / ML Services (Free & Open Source)
- Database
- Admin Panel

All clients communicate with a **single backend API**.

---

## 🧩 Architecture Diagram (Logical)

```
+-------------------+        +-------------------+
|   Web App         |        |   Mobile App      |
|  (Next.js)        |        |  (Flutter)        |
+---------+---------+        +---------+---------+
          |                            |
          | REST API (HTTPS / JWT)     |
          +------------+---------------+
                       |
               +-------v--------+
               |  FastAPI       |
               |  Backend API   |
               +-------+--------+
                       |
     +-----------------+------------------+
     |                 |                  |
+----v----+      +-----v------+     +-----v------+
|Database |      | AI Services |     | Admin Panel|
|(SQL)    |      | (Free APIs) |     | (Web UI)   |
+---------+      +-------------+     +------------+
```

---

## 🔐 Authentication Flow

1. User signs up / logs in
2. Backend issues JWT access & refresh tokens
3. Tokens are used for all API calls
4. Role-based authorization enforced (USER / ADMIN)

---

## 🤖 AI Integration Flow

- Voice Input → Whisper → Text
- Text → Rule Engine → AI Model
- AI output → User confirmation → Save to DB

Fallback logic ensures system works even if AI fails.

---

## 📊 Analytics Flow

- Expenses stored in DB
- Backend aggregates data
- Frontend renders charts & insights
- Optional AI summary generation

---

## 🧑‍💼 Admin Panel Scope

- Read-only analytics
- User statistics
- System health & logs
- Role-protected access

---

## 🧠 Design Principles

- Single backend source of truth
- Stateless APIs
- Modular services
- Cost-efficient (free-tier AI)
- Scalable architecture

---

## 📌 Notes for Contributors

- Keep backend APIs backward compatible
- UI should degrade gracefully without animations
- AI features must have fallbacks
