# models/event.py
from extensions import db

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.String(100), unique=True, nullable=True)  # ID único da API
    name = db.Column(db.String(255))
    date = db.Column(db.DateTime, nullable=True)  
    net = db.Column(db.DateTime, nullable=True)   
    image = db.Column(db.String(255))
    description = db.Column(db.Text)
