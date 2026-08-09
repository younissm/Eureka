# 🚀 Eureka Deployment Guide

## Render Deployment

### Prerequisites
- GitHub account with this repository
- Render account (https://render.com)
- PostgreSQL database (Render provides this)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy with render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Select your GitHub repository: `younissm/eureka`
4. Confirm settings in render.yaml
5. Click **"Deploy"**
6. Render will automatically:
   - Create PostgreSQL database
   - Deploy backend web service
   - Deploy frontend static site
   - Configure all environment variables

### Step 3: Manual Deployment (If not using render.yaml)

#### Deploy Backend
1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Choose **"Deploy an existing repository"**
4. Select `younissm/eureka`
5. Configure:
   - **Name**: eureka-backend
   - **Environment**: Python 3.11
   - **Region**: Oregon (or closest to you)
   - **Build Command**: 
     ```bash
     cd backend && pip install -r requirements.txt && python manage.py migrate --noinput
     ```
   - **Start Command**:
     ```bash
     cd backend && gunicorn ecommerce.wsgi --bind 0.0.0.0:8000 --workers 3
     ```

6. Create PostgreSQL Database:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `eureka-postgres`
   - Database: `eureka`
   - User: `eureka_user`
   - Region: Oregon
   - Copy the **Database URL**

7. Add Environment Variables:
   ```
   DJANGO_DEBUG=False
   DJANGO_SECRET_KEY=<generate-new-secure-key>
   DJANGO_ALLOWED_HOSTS=eureka-backend.onrender.com
   DATABASE_URL=<PostgreSQL URL from Step 6>
   CORS_ALLOWED_ORIGINS=https://eureka-frontend.onrender.com
   ENVIRONMENT=production
   ```

8. Click **"Create Web Service"**

#### Deploy Frontend
1. Click **"New +"** → **"Static Site"**
2. Select `younissm/eureka`
3. Configure:
   - **Name**: eureka-frontend
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build:production
     ```
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://eureka-backend.onrender.com
   ```

5. Click **"Create Static Site"**

### Step 4: Post-Deployment Setup

#### Update CORS & Allowed Hosts
After services are deployed and you have the URLs:

1. Go to Backend Web Service → **Settings**
2. Update Environment Variables:
   ```
   DJANGO_ALLOWED_HOSTS=eureka-backend.onrender.com,eureka.onrender.com,your-custom-domain.com
   CORS_ALLOWED_ORIGINS=https://eureka-frontend.onrender.com,https://your-custom-domain.com
   ```
3. **Save** - Service will redeploy

#### Create Admin User
1. Go to Backend Web Service → **Shell**
2. Run:
   ```bash
   cd backend && python manage.py createsuperuser
   ```
3. Access admin at: `https://eureka-backend.onrender.com/admin/`

### Step 5: Verify Deployment

✅ **Backend**
- Visit: `https://eureka-backend.onrender.com/api/products/`
- Should return JSON or empty list

✅ **Frontend**
- Visit: `https://eureka-frontend.onrender.com/`
- Should display React app

✅ **Admin Panel**
- Visit: `https://eureka-backend.onrender.com/admin/`
- Login with superuser credentials

## Environment Variables Reference

### Backend (.env or Render Settings)
```
# Django Core
DJANGO_DEBUG=False                          # Never True in production!
DJANGO_SECRET_KEY=<secure-random-key>      # Generate: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
DJANGO_ALLOWED_HOSTS=eureka-backend.onrender.com,your-domain.com
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/eureka

# CORS & Security
CORS_ALLOWED_ORIGINS=https://eureka-frontend.onrender.com,https://your-domain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# JWT Tokens
ACCESS_TOKEN_LIFETIME=3600
REFRESH_TOKEN_LIFETIME=86400
```

### Frontend (.env.production or Render Settings)
```
VITE_API_URL=https://eureka-backend.onrender.com
VITE_APP_NAME=Eureka
```

## Troubleshooting

### Build Failures

**Backend fails: "No module named django"**
- Check `backend/requirements.txt` exists
- Verify Python version (3.9+)
- Check build command includes `cd backend`

**Frontend fails: "npm run build:production not found"**
- Check `frontend/package.json` has this script
- Verify Node version (18+)
- Check build command includes `cd frontend`

### Runtime Errors

**"ModuleNotFoundError: No module named 'django'"**
- Build command didn't install requirements
- Re-deploy and check build logs

**Database connection error**
- Verify DATABASE_URL is set correctly
- Check PostgreSQL service is running
- Restart PostgreSQL from Render dashboard

**CORS errors in browser**
- Update `CORS_ALLOWED_ORIGINS` with actual frontend URL
- Ensure both services use HTTPS
- Redeploy backend after updating

### Frontend Issues

**Blank page or 404**
- Check `npm run build:production` runs successfully
- Verify `frontend/dist` folder exists after build
- Check Render logs for errors

**API requests failing**
- Verify `VITE_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is running (visit `/api/`)

## Monitoring

### View Logs
1. Render Dashboard → Service → **Logs**
2. Filter by:
   - Build logs (during deployment)
   - Deploy logs (after deployment)
   - Runtime logs (after service running)

### Common Log Patterns

✅ **Success**
```
[...] Starting gunicorn
[...] Listening at: http://0.0.0.0:8000
```

❌ **Database error**
```
OperationalError: could not connect to server
→ Check DATABASE_URL
→ Verify PostgreSQL is running
```

❌ **Module not found**
```
ModuleNotFoundError: No module named 'django'
→ Check requirements.txt
→ Check build command
```

## Continuous Deployment

Render automatically deploys when you push to `main` branch:

1. Push changes: `git push origin main`
2. Render detects and starts build
3. Check progress in Render Dashboard
4. Auto-redeploys on success

## Database Management

### Access PostgreSQL
```bash
# Get connection string from Render Dashboard
# PostgreSQL → eureka-postgres → Info

psql postgresql://user:password@host:5432/eureka
```

### Backups
- Render auto-backups daily
- Download from: PostgreSQL → Backups
- Keep backups for disaster recovery

## Custom Domain

### Connect Custom Domain
1. Render Dashboard → Backend Service → **Settings**
2. **Custom Domains** → Add Domain
3. Add your domain (e.g., `api.example.com`)
4. Update DNS records with your provider:
   - Type: `CNAME`
   - Value: Render provides
5. SSL auto-generates (free)

### Update Django Settings
After adding custom domain, update:
```
DJANGO_ALLOWED_HOSTS=api.example.com,eureka-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://example.com,https://eureka-frontend.onrender.com
```

## Performance Tips

1. **Enable Caching**: Add Redis for session/cache storage
2. **Optimize Images**: Compress before upload
3. **Code Splitting**: Frontend auto-handled by Vite
4. **Database Indexes**: Add on frequently queried fields
5. **CDN**: Use for static assets (images, CSS, JS)

## Security Checklist

- ✅ DJANGO_DEBUG=False
- ✅ Strong DJANGO_SECRET_KEY (not hardcoded)
- ✅ ALLOWED_HOSTS properly configured
- ✅ CORS_ALLOWED_ORIGINS restricted
- ✅ HTTPS enabled (Render auto-provides)
- ✅ Database backups enabled
- ✅ Secure passwords for admin
- ✅ Regular dependency updates

## Support

- **Render**: https://support.render.com
- **Django**: https://docs.djangoproject.com
- **React**: https://react.dev
- **GitHub Issues**: https://github.com/younissm/eureka/issues

---

**Happy Deploying! 🚀**
