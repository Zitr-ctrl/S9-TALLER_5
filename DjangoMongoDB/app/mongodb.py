# app/mongodb.py
import mongoengine

def init_mongo():
    mongoengine.connect(
        db="crudmongo",
        host="localhost",
        port=27017,
        username="",
        password=""
    )
