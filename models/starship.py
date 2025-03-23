from extensions import db

class Starship(db.Model):
    __tablename__ = 'starship'
    
    id = db.Column(db.Integer, primary_key=True)
    starship_id = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(100))
    image = db.Column(db.String(500))
    
    def __repr__(self):
        return f"<Starship {self.name}>"
