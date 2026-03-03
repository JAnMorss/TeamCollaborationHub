# 🛠 Team Collaboration Hub

A full-stack collaboration platform built with **ASP.NET Core** (backend) and **React + TypeScript + Tailwind CSS** (frontend).  
Demonstrates **Clean Architecture, CQRS, DDD, MediatR**, **SignalR**, and **Docker** for professional backend and full-stack engineering.

---

## 🚀 Features

### Backend API
- 🔐 User authentication & authorization (JWT)
- 👥 Team and user management
- 📋 Roles and permissions for team members
- 📮 Team invites & membership handling
- ⚡ Real-time notifications and updates with **SignalR**
- 🧩 CQRS via **MediatR** (commands & queries)
- 📦 Fully containerized with **Docker**
- 🧪 Unit tests for domain and application logic
- 📝 Swagger API documentation

### Frontend (React)
- 🖥 **Dashboard page** – Overview of teams, tasks, and notifications
- 📂 **Project page** – Manage projects within a team
- 👥 **Project members page** – See and manage team members
- ✅ **Task management & assign task page** – Create and assign tasks to members
- 📅 **Calendar page** – Visualize tasks and events (almost complete)
- ⚡ Built with **React + TypeScript** for type safety
- 🎨 Styled with **Tailwind CSS** for responsive and modern UI
- 🔄 Connects to backend via REST API and SignalR for real-time updates

> Backend is fully functional; frontend is mostly complete, with final touches on calendar interactions.

---

## 🧰 Tech Stack

| Layer / Component | Technology |
|------------------|------------|
| Backend | ASP.NET Core |
| Frontend | React + TypeScript + Tailwind CSS |
| Architecture | Clean Architecture (Onion / Hexagonal) |
| Patterns | CQRS, DDD, MediatR |
| Real-time | SignalR |
| Database | EF Core |
| Auth | JWT / Token |
| Containerization | Docker |
| Testing | xUnit |
| API Docs | Swagger |

---

## 📦 Installation / Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/JAnMorss/TeamCollaborationHub.git
cd TeamCollaborationHub
