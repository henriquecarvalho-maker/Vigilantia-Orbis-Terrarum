# space.py
from flask import Flask, render_template, Blueprint
from datetime import datetime, timezone
from launch_api import get_upcoming_launches, get_upcoming_events
from launch_api import get_past_launches

space_bp = Blueprint('space', __name__, template_folder='templates')


def parse_datetime(dt_str):
    dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt

space_bp = Blueprint('space', __name__, template_folder='templates')

@space_bp.route('/space')
def space():
    launches = get_upcoming_launches(limit=10)
    events = get_upcoming_events(limit=10)

    now_utc = datetime.now(timezone.utc)
    # Filtra lançamentos futuros
    launches = [
        l for l in launches
        if parse_datetime(l['net']) > now_utc
    ]

    if launches:
        launches.sort(key=lambda x: datetime.fromisoformat(x['net']))
        destaque = launches[0]
        destaque['imagem'] = destaque.get('image') or "static/images/default.png"
        destaque['cor_fonte'] = "#fffaf2"
        noticias_rocket = launches[1:]
    else:
        destaque = {
            "name": "Sem lançamentos disponíveis",
            "image": "static/images/default.png",
            "url": "#",
            "net": "",
            "cor_fonte": "#fffaf2"
        }
        noticias_rocket = []

    # Ajusta as imagens dos eventos
    for evento in events:
        caminho_imagem = evento.get('image') or "static/images/default_event.png"
        evento['imagem'] = caminho_imagem

    return render_template('space.html', destaque=destaque, noticias_rocket=noticias_rocket, eventos=events)

@space_bp.route('/past-launches')
def past_launches():
    launches = get_past_launches(limit=100)  # ou ajuste conforme necessário
    # Valores default para paginação
    current_page = 1
    total_pages = 1
    page_range = [1]
    return render_template('past_launches.html', launches=launches, 
                           current_page=current_page, total_pages=total_pages, page_range=page_range)
