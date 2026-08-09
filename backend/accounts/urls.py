from django.urls import path
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [

    path('signup', views.UserCreateView.as_view(), name='user-sign-up'),
    path('me', views.CurrentUserView.as_view(), name='current-user'),
    path('updateMe', views.CurrentUserView.as_view(), name='current-user-update'),

    path('<int:pk>', views.UserDetailView.as_view(), name='user-detail'),
    path('', views.UserListView.as_view(), name='user-list'),
    path('login', views.EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgotPassword', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('resetPassword/<str:token>', views.ResetPasswordView.as_view(), name='reset_password'),
    path('updateMyPassword', views.UpdateMyPasswordView.as_view())
]
