# app/models_mongo.py
from mongoengine import Document, StringField, IntField

class Producto(Document):
    nombre = StringField(required=True)
    descripcion = StringField()
    stock = IntField(default=0)
