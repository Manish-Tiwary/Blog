from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'slug', 'featured_image', 'content']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter post title...'}),
            'slug': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. my-first-post'}),
            'content': forms.Textarea(attrs={'class': 'form-input textarea', 'placeholder': 'Write your article contents here...'}),
        }
