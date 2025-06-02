from django.apps import AppConfig
from .mongodb import init_mongo


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        init_mongo()
