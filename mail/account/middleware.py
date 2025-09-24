from django.http import HttpResponseForbidden
from django.urls import resolve

class UsernameURLMiddleware:
    """
    Ensures that the <username> in the URL matches the logged-in user.
    Blocks access if mismatched.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Check if the URL has a 'username' kwarg
        username_in_url = view_kwargs.get("username", None)

        if username_in_url:
            # If user is not authenticated
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Not authorized. Please log in.")

            # If logged-in user's username != username in URL
            if request.user.username != username_in_url:
                return HttpResponseForbidden("You are not authorized to access this page.")

        return None