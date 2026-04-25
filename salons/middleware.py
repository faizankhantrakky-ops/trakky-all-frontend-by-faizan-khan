from django.contrib.auth.models import User
from django.utils import timezone
from .models import AuditLog
from django.contrib.auth.models import AnonymousUser
import re
import json

class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        pre_request_data = None

        # Skip processing if the request is uploading a file
        if not request.content_type.startswith('multipart/form-data'):
            try:
                if request.method in ['POST', 'PUT', 'PATCH']:
                    if request.content_type == 'application/json':
                        pre_request_data = json.loads(request.body)
                    else:
                        pre_request_data = request.POST.dict()
                else:
                    pre_request_data = request.POST.dict()
            except json.JSONDecodeError:
                pre_request_data = None

        response = self.get_response(request)

        # Log the action for every request
        action = f'{request.method} {request.path}'

        # Check if request.user is a valid User instance
        user = request.user if isinstance(request.user, User) else None

        # Create the details string
        if request.method == 'DELETE':
            # Extract the main resource and sub-resource from the URL
            resources = request.path.strip('/').split('/')
            if len(resources) >= 2:
                main_resource, sub_resource = resources[-2:]
                if sub_resource.isdigit():
                    details = f'Deleted {main_resource} - {sub_resource}'
                else:
                    details = f'Deleted {main_resource}'
            else:
                details = f'Deleted {resources[-1]}'

        elif isinstance(pre_request_data, dict):
            changed_fields = ', '.join(pre_request_data.keys())
            details = f'Change in {changed_fields}'

        elif isinstance(pre_request_data, list):
            try:
                keys = set()
                for item in pre_request_data:
                    if isinstance(item, dict):
                        keys.update(item.keys())
                changed_fields = ', '.join(keys)
                details = f'Change in multiple items: {changed_fields}' if changed_fields else 'Change in multiple items'
            except Exception:
                details = f'Changes in {len(pre_request_data)} item(s)'

        else:
            details = 'Unidentified changes'

        if request.method != 'GET':
            AuditLog.objects.create(user=user, action=action, details=details)

        return response