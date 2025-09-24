from django.shortcuts import render, redirect
from django.http import HttpResponseForbidden
from django.urls import reverse
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib import messages
from .models import User
from .forms import UserForm, SigninForm

def signup(request):

    '''
    Handles user registration for OwlphaDAO Admin dashboard.
    Prevents already authenticated users from signing up again by redirecting to home.
    On POST request with valid data:
    - Creates a new user with active status.

    On GET request, displays the registration form.
    '''

    if request.user.is_authenticated:
        # Redirect to home page if user is already logged in
        return redirect('admin_dashboard')

    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('admin_dashboard', username=request.user.username)
    else:
        form = UserForm()

    context = {
        'form': form,
        'title': 'OwlphaDAO SignUp | Admin Management Dashboard',
    }

    return render(request, 'pages/signup.html', context)


def signin(request):

    ''''
    Handles user sign-in using either email or username.
    If already authenticated, redirects to the home page.
    On valid form submission, attempts authentication and logs the user in.
    If authentication fails, displays an error message.
    '''

    if request.user.is_authenticated:
        # Redirect to home page if user is already logged in
        return redirect('admin_dashboard', username=request.user.username)

    if request.method == 'POST':
        form = SigninForm(request.POST)
        if form.is_valid():
            identifier = form.cleaned_data['identifier']
            password = form.cleaned_data['password']

            # Try authenticating by username or email
            user = authenticate(request, username=identifier, password=password)

            if user:
                auth_login(request, user)
                next_url = request.GET.get('next')
                if next_url:
                    return redirect(next_url)
                return redirect('admin_dashboard', username=request.user.username)
            else:
                messages.error(request, "Invalid credentials. Please check and try again.")

    else:
        form = SigninForm()

    context = {
        'form': form,
        'title': 'OwlphaDAO | Admin Management Dashboard',
    }

    return render(request, 'pages/signin.html', context)


def logout(request):

    '''
    Logs out the current user while preserving session data (if any non-auth-related data exists).
    After logout, the user is redirected to the home page.
    '''
    auth_logout(request)
    return redirect('add_subscriber')