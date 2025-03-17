# models/launch.py
from extensions import db

class Launch(db.Model):
    __tablename__ = 'launches'
    id = db.Column(db.Integer, primary_key=True)
    launch_id = db.Column(db.String(100), unique=True, nullable=True)  # ID único da API
    name = db.Column(db.String(255))
    net = db.Column(db.DateTime)
    image = db.Column(db.String(255))
    status = db.Column(db.String(100))  
    mission_description = db.Column(db.Text, nullable=True) 
    agency_name = db.Column(db.String(255), nullable=True)   # Novo campo para nome da agência