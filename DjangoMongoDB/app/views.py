from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .models_mongo import Producto
from bson import ObjectId
import re

def lista_productos(request):
    productos = Producto.objects()
    return render(request, 'app/lista.html', {'productos': productos})

@csrf_exempt
def crear_producto(request):
    errores = []
    nombre = ''
    descripcion = ''
    stock = ''

    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        descripcion = request.POST.get('descripcion', '').strip()
        stock = request.POST.get('stock', '').strip()

        if not nombre:
            errores.append("El nombre es obligatorio.")
        elif any(char.isdigit() for char in nombre):
            errores.append("El nombre no puede contener números.")

        if not descripcion:
            errores.append("La descripción es obligatoria.")
        elif len(descripcion) < 5:
            errores.append("La descripción debe tener al menos 5 caracteres.")

        if not stock:
            errores.append("El stock es obligatorio.")
        elif not stock.isdigit() or int(stock) <= 0:
            errores.append("El stock debe ser un número entero positivo.")

        if errores:
            return render(request, 'app/crear.html', {
                'errores': errores,
                'nombre': nombre,
                'descripcion': descripcion,
                'stock': stock,
                'producto': None  # necesario para el template
            })

        Producto(
            nombre=nombre,
            descripcion=descripcion,
            stock=int(stock)
        ).save()
        return redirect('lista_productos')

    # GET method (formulario vacío con variables definidas)
    return render(request, 'app/crear.html', {
        'errores': [],
        'nombre': '',
        'descripcion': '',
        'stock': '',
        'producto': None
    })

@csrf_exempt
def editar_producto(request, producto_id):
    producto = Producto.objects(id=ObjectId(producto_id)).first()
    errores = []

    if request.method == 'POST':
        nombre = request.POST.get('nombre', '').strip()
        descripcion = request.POST.get('descripcion', '').strip()
        stock = request.POST.get('stock', '').strip()

        # Validaciones
        if not nombre:
            errores.append("El nombre es obligatorio.")
        elif any(char.isdigit() for char in nombre):
            errores.append("El nombre no puede contener números.")

        if not descripcion:
            errores.append("La descripción es obligatoria.")
        elif len(descripcion) < 5:
            errores.append("La descripción debe tener al menos 5 caracteres.")

        if not stock:
            errores.append("El stock es obligatorio.")
        elif not stock.isdigit() or int(stock) <= 0:
            errores.append("El stock debe ser un número entero positivo.")

        if errores:
            return render(request, 'app/editar.html', {
                'errores': errores,
                'producto': producto,
                'nombre': nombre,
                'descripcion': descripcion,
                'stock': stock
            })

        # Guardar cambios
        producto.nombre = nombre
        producto.descripcion = descripcion
        producto.stock = int(stock)
        producto.save()
        return redirect('lista_productos')

    return render(request, 'app/editar.html', {'producto': producto})

@csrf_exempt
def eliminar_producto(request, producto_id):
    producto = Producto.objects(id=ObjectId(producto_id)).first()
    if producto:
        producto.delete()
    return redirect('lista_productos')
