# 🚀 Eureka - Fullstack E-Commerce Platform

A production-ready fullstack e-commerce application with Django REST Framework backend and React + Vite frontend, deployed on Render.

## 📋 Project Structure

```
eureka/
├── backend/                    # Django REST API (Python)
│   ├── ecommerce/             # Django project config
│   ├── accounts/              # User authentication & management
│   ├── store/                 # E-commerce products & orders
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # React + Vite SPA (JavaScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── docker-compose.yml         # Local development setup
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
├── render.yaml               # Render deployment config
└── README.md
```

## 🏗️ Tech Stack

### Backend
- **Django 6.0.4** - Web framework
- **Django REST Framework** - API framework
- **Simple JWT** - Authentication
- **Django CORS Headers** - Cross-origin requests
- **PostgreSQL** - Production database
- **SQLite** - Development database

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool & dev server
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **Chakra UI** - Component library
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (for production)
- Docker & Docker Compose (optional)

### Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/younissm/eureka.git
cd eureka
```

#### 2. Setup Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

#### 3. Setup Frontend
```bash
cd frontend-proto

# Install dependencies
npm install

# Create .env file
cp .env.example .env.development

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Docker Development Setup

```bash
# From project root
docker-compose up -d

# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

## 🚂 Deployment on Render

### Backend Deployment

1. **Connect GitHub Repository** to Render
2. **Create Web Service**:
   - Name: `eureka-backend`
   - Environment: Python 3.11
   - Build Command: `cd backend && pip install -r requirements.txt && python manage.py migrate`
   - Start Command: `cd backend && gunicorn ecommerce.wsgi`
   - Add Environment Variables (from `.env.example`)

3. **Add Environment Variables**:
   - `DJANGO_DEBUG=False`
   - `DJANGO_SECRET_KEY=<generate-secure-key>`
   - `DJANGO_ALLOWED_HOSTS=eureka-backend.onrender.com,eureka.onrender.com`
   - `DATABASE_URL=<PostgreSQL connection string>`
   - `CORS_ALLOWED_ORIGINS=https://eureka-frontend.onrender.com`

> Alternative: Host the Django backend on PythonAnywhere and keep the frontend on Render or another static host.
> On PythonAnywhere, configure the web app to use `backend/ecommerce/wsgi.py`, set `DJANGO_DEBUG`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, and `CORS_ALLOWED_ORIGINS` in the Web tab, and use an external Postgres provider for production.

### Frontend Deployment

1. **Create Static Site** on Render
2. **Settings**:
   - Name: `eureka-frontend`
   - Build Command: `cd frontend && npm install && npm run build:production`
   - Publish Directory: `frontend/dist`
   - Add Environment Variables:
     - `VITE_API_URL=https://eureka-backend.onrender.com`

### Automated Deployment with `render.yaml`

Use the included `render.yaml` for one-click deployment:

```bash
# Deploy from Render Dashboard
# Services will be auto-configured from render.yaml
```

## 🔧 Development Scripts

### Backend
```bash
cd backend
python manage.py runserver          # Start dev server
python manage.py migrate            # Run migrations
python manage.py makemigrations     # Create migrations
python manage.py createsuperuser    # Create admin user
python manage.py test               # Run tests
```

### Frontend
```bash
cd frontend
npm run dev                 # Start dev server
npm run build:staging       # Build for staging
npm run build:production    # Build for production
npm run lint               # Lint code
npm run preview            # Preview production build
```

## 🔐 Security

- Always use environment variables for sensitive data
- Never commit `.env` files
- Use `DJANGO_DEBUG=False` in production
- Update `DJANGO_SECRET_KEY` in production
- Configure `ALLOWED_HOSTS` properly
- Use HTTPS in production
- Enable CSRF protection
- Validate all inputs on backend

## 📝 API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - Get access token
- `POST /api/users/refresh` - Refresh access token

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create product (Admin)
- `PUT /api/products/{id}/` - Update product (Admin)
- `DELETE /api/products/{id}/` - Delete product (Admin)

### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (Admin)

### Reviews
- `GET /api/products/{id}/reviews/` - Get product reviews
- `POST /api/products/{id}/reviews/` - Create review

## 📚 Documentation

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Render Documentation](https://render.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Younis** - [GitHub Profile](https://github.com/younissm)

---

**Happy Coding! 🎉**
