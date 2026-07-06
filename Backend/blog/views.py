from django.views import generic
from .models import Post
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from .forms import PostForm
from django.http import JsonResponse
from .models import Post

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify


@api_view(['POST'])
@permission_classes([IsAdminUser])
def api_create_post(request):
    title = request.data.get('title')
    content = request.data.get('content')
    slug = request.data.get('slug')
    
    if not slug:
        slug = slugify(title)
        
    featured_image = request.FILES.get('featured_image')

    post = Post.objects.create(
        title=title,
        slug=slug,
        content=content,
        author=request.user,
        featured_image=featured_image
    )
    return Response({'message': 'Post created successfully!', 'id': post.id}, status=status.HTTP_201_CREATED)

@api_view(['POST', 'PUT'])
@permission_classes([IsAdminUser])
def api_edit_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    
    post.title = request.data.get('title', post.title)
    post.slug = request.data.get('slug', post.slug)
    post.content = request.data.get('content', post.content)
    
    if 'featured_image' in request.FILES:
        post.featured_image = request.FILES['featured_image']
        
    post.save()
    return Response({'message': 'Post updated successfully!'})

@api_view(['DELETE', 'POST'])
@permission_classes([IsAdminUser])
def api_delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.delete()
    return Response({'message': 'Post deleted successfully!'}, status=status.HTTP_200_OK)

def api_post_list(request):
    posts = Post.objects.order_by('-created_on')
    data = []
    for post in posts:
        data.append({
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'author': post.author.username,
            'content': post.content,
            'featured_image': request.build_absolute_uri(post.featured_image.url) if post.featured_image else None,
            'created_on': post.created_on.strftime("%B %d, YYYY")
        })
    return JsonResponse(data, safe=False)

def api_post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    data = {
        'id': post.id,
        'title': post.title,
        'slug': post.slug,
        'author': post.author.username,
        'content': post.content,
        'featured_image': request.build_absolute_uri(post.featured_image.url) if post.featured_image else None,
        'created_on': post.created_on.strftime("%B %d, YYYY")
    }
    return JsonResponse(data)

# Open blog/views.py and ensure NO decorators are placed right above this block:
def api_post_list(request):
    posts = Post.objects.order_by('-created_on')
    data = []
    for post in posts:
        data.append({
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'author': post.author.username,
            'content': post.content,
            'featured_image': request.build_absolute_uri(post.featured_image.url) if post.featured_image else None,
            'created_on': post.created_on.strftime("%B %d, YYYY")
        })
    return JsonResponse(data, safe=False)



@staff_member_required(login_url='admin:login')
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user  # Automatically assigns the logged-in admin as author
            post.save()
            return redirect('admin_dashboard')
    else:
        form = PostForm()
    return render(request, 'post_form.html', {'form': form, 'title': 'Write New Article'})

@staff_member_required(login_url='admin:login')
def edit_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            return redirect('admin_dashboard')
    else:
        form = PostForm(instance=post)
    return render(request, 'post_form.html', {'form': form, 'title': 'Edit Article'})

@staff_member_required(login_url='admin:login')
def admin_dashboard(request):
    # Fetch all articles ordered by the latest published date
    posts = Post.objects.order_by('-created_on')
    return render(request, 'dashboard.html', {'posts': posts})

@staff_member_required(login_url='admin:login')
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        post.delete()
        return redirect('admin_dashboard')
    return render(request, 'delete_confirm.html', {'post': post})


class PostList(generic.ListView):
    queryset = Post.objects.order_by('-created_on')
    template_name = 'index.html'

# Verify this class name is written exactly as "PostDetail"
class PostDetail(generic.DetailView):
    model = Post
    template_name = 'post_detail.html'



