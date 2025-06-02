# 🗃️ CRUD Multi-Tecnología: Django & Node.js con PostgreSQL y MongoDB

Este repositorio contiene 4 proyectos CRUD de inventario implementados con las tecnologías más utilizadas en desarrollo web:

- 🔵 Django + PostgreSQL  
- 🟢 Django + MongoDB  
- 🟦 Node.js + PostgreSQL  
- 🟩 Node.js + MongoDB  

Todos los proyectos incluyen validaciones, vistas (EJS o HTML con Tailwind CSS), operaciones básicas (crear, leer, actualizar, eliminar), y soporte para pruebas con herramientas como Postman o ThunderClient.

---

## 🛠️ Tecnologías utilizadas

| Proyecto                  | Backend  | Base de Datos | Frontend / Plantillas | Validaciones         |
|---------------------------|----------|----------------|------------------------|----------------------|
| Django + PostgreSQL       | Django   | PostgreSQL     | HTML + Tailwind CSS    | Forms (server-side)  |
| Django + MongoDB          | Django   | MongoDB        | HTML + Tailwind CSS    | JS + Forms           |
| Node.js + PostgreSQL      | Express  | PostgreSQL     | EJS + Tailwind CSS     | JS + Backend         |
| Node.js + MongoDB         | Express  | MongoDB        | EJS + Tailwind CSS     | JS + Backend         |

---

## 🧩 Proyectos Incluidos

### 1. Django + PostgrSQL o MongoDB

- ORM nativo de Django
- Validaciones en `forms.py`
- CRUD funcional con vistas HTML estilizadas con Tailwind CSS
- Conexión configurada desde `settings.py`
- Soporte para CSRF y rutas seguras

---

### 2. Django + MongoDB o PostgreSQL

- Integración con MongoDB usando `mongoengine`
- Modelos personalizados con validaciones propias
- Formularios HTML con restricciones + validación JS
- Vista tipo lista, crear, editar y eliminar
- ThunderClient/Postman requiere desactivar CSRF

---

## 📦 Dependencias

### 🔵 Django + PostgreSQL 
django psycopg2 

### 🟢 Django + MongoDB  
django mongoengine

### 🟦 Node.js + PostgreSQL  
body-parser ejs express nodemon pg

### 🟩 Node.js + MongoDB 
body-parser ejs express method-override mongoose nodemon

--- 

🔍 **Validaciones:**
- `nombre` y `descripción`: solo letras, longitud mínima
- `stock`: número entero positivo
- JS en el frontend + validaciones en backend

--- 
##🚀 Cómo ejecutar cada proyecto

###🟩 Node.js + MongoDB
cd node_mongodb
npm install
node server.js

###🟦 Node.js + PostgreSQL
-cd node_postgresql
-npm install
-node index.js

###🔵 Django + PostgreSQL
-cd django_postgresql
-pip install -r requirements.txt
-python manage.py migrate
-python manage.py runserver

###🟢 Django + MongoDB
-cd django_mongodb
-pip install -r requirements.txt
-Asegúrate de configurar mongoengine en settings.py
-python manage.py runserver

🧪 **Pruebas con Postman**:

```http
POST http://localhost:3000/crear
{
  "nombre": "Zapato",
  "descripcion": "Calzado",
  "stock": 15
}

PUT http://localhost:3000/editar/1
{
  "nombre": "Camisa",
  "descripcion": "Ropa",
  "stock": 10
}

DELETE http://localhost:3000/eliminar/1
```

