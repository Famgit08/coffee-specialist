import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

key_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-key.json")

cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_db():
    return db