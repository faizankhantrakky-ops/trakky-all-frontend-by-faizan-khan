from django.apps import AppConfig
from django.core.cache import cache
from django.db import connection, ProgrammingError, OperationalError


class SalonsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "salons"

    def ready(self):
        """Perform initialization tasks when the app is ready."""
        try:
            if self.table_and_column_exists('salons_salon', 'secondary_areas'):
                from salons.models import Salon  # Avoid circular import
                self.warm_up_cache(Salon)
        except (ProgrammingError, OperationalError):
            # This avoids crashes during makemigrations/migrate when tables may not exist yet
            pass

    def warm_up_cache(self, Salon):
        """Preloads Salon data into cache at startup."""
        try:
            queryset = Salon.objects.all().select_related(
                "vendor", "user"
            ).prefetch_related("services_set", "client_images")

            # Force evaluation and cache safe-to-serialize list
            salon_list = list(queryset)
            cache.set("salon_queryset", salon_list, timeout=30 * 60)
        except (ProgrammingError, OperationalError):
            # Handle case where related tables/fields may not exist yet
            pass

    def table_and_column_exists(self, table_name, column_name):
        """Check if a table and specific column exists in the DB."""
        with connection.cursor() as cursor:
            tables = connection.introspection.table_names()
            if table_name in tables:
                columns = [col.name for col in connection.introspection.get_table_description(cursor, table_name)]
                return column_name in columns
        return False
