
# Manish Blog - Next.js &  Django Blog
A modern, full-stack headless blog platform featuring a **Next.js (App Router)** frontend and a **Django REST Framework (DRF)** backend. The platform includes JWT authentication, a dynamic admin management dashboard, and media management.

---

## 🏗️ Project Architecture & Directory Structure

The project is split into a completely decoupled backend (API) and frontend (UI):

```text
Blog/
├── Backend/                 # Django Web API
│   ├── blog/                # Main Django App (Models, Views, Serializers)
│   ├── myproject/           # Project Configuration
│   ├── env/                 # Python Virtual Environment
│   ├── media/               # Uploaded blog media/images
│   ├── db.sqlite3           # Local development database
│   ├── manage.py            # Django management script
│   └── README.md
│
└── frontend/                # Next.js Client App (Note: folder misspelled as 'forntend')
    ├── app/                 # Next.js App Router
    │   ├── components/      # Reusable client/server UI components
    │   ├── dashboard/       # Protected Admin Dashboard view
    │   ├── login/           # Authentication page
    │   ├── posts/           # Blog post routing pages
    │   ├── layout.tsx       # Root layout configuration
    │   └── page.tsx         # Public landing page
    ├── public/              # Static public assets
    ├── utils/               # Fetch configurations and helper functions
    ├── next.config.ts       # Next.js settings
    └── package.json

```

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS
* **State & Auth Management:** Client-side token storage (`localStorage`) synced with JWT infrastructure

### Backend

* **Framework:** Django & Django REST Framework (DRF)
* **Authentication:** Django Simple JWT (JSON Web Tokens)
* **Database:** SQLite (Development Default)

---

## 🚀 Getting Started

### Prerequisites

* Python 3.8+
* Node.js v18+ & npm/pnpm/yarn

---

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd Backend

```


2. Activate the virtual environment:
* **Windows:**
```bash
.\env\Scripts\activate

```


* **macOS/Linux:**
```bash
source env/bin/activate

```




3. Install requirements (make sure you freeze/install your requirements):
```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

```


4. Run migrations to initialize the database:
```bash
python manage.py migrate

```


5. Create an administrative user (to log into the dashboard):
```bash
python manage.py createsuperuser

```


6. Boot up the local API development server:
```bash
python manage.py runserver

```


*The backend will run on `http://127.0.0.1:8000/*`

---

### 2. Frontend Setup (Next.js)

1. Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend

```


2. Install the necessary dependencies:
```bash
npm install

```


3. Start the local development node:
```bash
npm run dev

```


*The frontend will run on `http://localhost:3000/*`

---

## 🔒 Authentication Flow

1. The Admin submits login credentials via `/login`.
2. The UI sends a `POST` request to `http://127.0.0.1:8000/api/token/`.
3. Upon validation, the backend returns an `access` and `refresh` JWT token pair.
4. Tokens are stored securely inside the browser's `localStorage` space.
5. The frontend utilizes a dynamic `<Navbar />` utility that checks for the presence of the `access_token` to toggle the user state gracefully between **Login** and **Logout** options.

```

***

