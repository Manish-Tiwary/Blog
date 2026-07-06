from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostList.as_view(), name='home'),
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/write/', views.create_post, name='create_post'),
    path('dashboard/edit/<int:pk>/', views.edit_post, name='edit_post'),
    path('dashboard/delete/<int:pk>/', views.delete_post, name='delete_post'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
]
