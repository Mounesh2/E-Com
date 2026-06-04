import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Creates a superuser admin account if one does not already exist'

    def handle(self, *args, **options):
        User = get_user_model()

        email = os.environ.get('ADMIN_EMAIL', 'admin@gmail.com')
        password = os.environ.get('ADMIN_PASSWORD', 'Admin@123456')

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'Admin user "{email}" already exists. Skipping.')
            )
        else:
            User.objects.create_superuser(
                email=email,
                password=password,
            )
            self.stdout.write(
                self.style.SUCCESS(f'Superuser "{email}" created successfully!')
            )
