# app/models.py

from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre
