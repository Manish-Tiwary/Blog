from django.views import generic
from .models import Post

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.admin.views.decorators import staff_member_required

from django.contrib.auth.decorators import login_required
from .forms import PostForm

from django.http import JsonResponse
from .models import Post

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



