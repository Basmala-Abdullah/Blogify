# Blogify 📝✨

A full-stack blogging platform built with Django (backend) and React (frontend) with Supabase authentication.

## Live Demo 🌐
- **Backend**: [https://blogify-dat3.onrender.com/](https://blogify-dat3.onrender.com/)
- **Frontend**: [https://blogify-alpha-six.vercel.app/](https://blogify-alpha-six.vercel.app/)
> 💡 Note: The backend should be running before using the frontend.

## Features ✨

- **User Authentication** 🔐
  - Sign up, login, and password reset
  - JWT token-based authentication
- **Blog Posts** 📄
  - Create, read, update, and delete posts
  - Rich text content with optional images
  - Pagination for post listings
- **User Profiles** 👤
  - View posts by specific authors
- **Responsive Design** 📱
  - Works on desktop and mobile devices

## Tech Stack 🛠️

### Backend
- **Python** 🐍
- **Django** 🎸
- **Django REST Framework** 🔄
- **Supabase** (Authentication + Database) 🔥
- **Render** (Hosting) ☁️

### Frontend
- **React** ⚛️
- **React Hook Form** 📋
- **Tailwind CSS** 🎨
- **DaisyUI** (UI Components) 🌼
- **Vercel** (Hosting) ▲

## Project Structure 📂

```
blogify/
├── backend/
│     ├── blogify_backend/        # Django backend
│       ├── blogify_backend/      # Django project
│       │   ├── settings.py       # Django settings
│       │   ├── urls.py           # Main URLs
│       │       └── ...
│       ├── posts/                # Posts app
│       │   ├── models.py         # Post model
│       │   ├── views.py          # API views
│       │   ├── urls.py           # App URLs
│       │   └── ...
│       └── ...
└── frontend/                 # React frontend
    ├── src/                  # Source code
    │   ├── components/       # React components
    │   │   ├── Auth/         # Auth components
    │   │   ├── Posts/        # Post components
    │   │   └── ...
    │   ├── services/         # API services
    │   └── ...
    └── ...
```

## Setup Instructions 🚀

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm/yarn
- Supabase account

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Basmala-Abdullah/Blogify.git
   cd backend/blogify_backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the frontend directory with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_IMAGEBB_API_KEY=your_imgbb_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints 📡

The backend provides the following API endpoints:

- `GET /posts/` - List all posts
- `POST /posts/` - Create a new post
- `GET /posts/<id>/` - Get a specific post
- `PUT /posts/<id>/` - Update a post
- `DELETE /posts/<id>/` - Delete a post
- `GET /posts/user/<user_id>/` - Get posts by a specific user

## Deployment 🚀

The project is configured for easy deployment:

- **Backend**: Automatically deploys to Render when pushed to main branch
- **Frontend**: Automatically deploys to Vercel when pushed to main branch

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

Made with ❤️ by Basmala Abdullah
