from django.urls import path
from . import views


urlpatterns = [
    path('', views.PostList.as_view(), name='home'),
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/write/', views.create_post, name='create_post'),
    path('dashboard/edit/<int:pk>/', views.edit_post, name='edit_post'),
    path('dashboard/delete/<int:pk>/', views.delete_post, name='delete_post'),
    path('api/posts/', views.api_post_list, name='api_post_list'),
    path('api/posts/create/', views.api_create_post, name='api_create_post'),
    path('api/posts/edit/<int:pk>/', views.api_edit_post, name='api_edit_post'),
    path('api/posts/delete/<int:pk>/', views.api_delete_post, name='api_delete_post'),
    path('api/posts/upload-image/', views.api_upload_image, name='api_upload_image'),
    path('api/posts/<slug:slug>/', views.api_post_detail, name='api_post_detail'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
]