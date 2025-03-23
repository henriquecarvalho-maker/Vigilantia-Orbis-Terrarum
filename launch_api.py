# api/update_data.py
import requests
from datetime import datetime, timezone
from extensions import db
from models.launch import Launch
from models.event import Event
from sqlalchemy import or_

BASE_URL = "https://ll.thespacedevs.com/2.2.0"

def update_launches(limit=20):
    endpoint = f"{BASE_URL}/launch/upcoming/"
    params = {"limit": limit}
    try:
        response = requests.get(endpoint, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        launches_data = data.get("results", [])
        for l in launches_data:
            api_id = l.get("id")
            net_str = l.get("net")
            net_dt = datetime.fromisoformat(net_str.replace('Z', '+00:00')) if net_str else None
            image = l.get("image") or l.get("rocket", {}).get("configuration", {}).get("image_url") or "static/images/default.png"
            status = l.get("status", {}).get("name", "Desconhecido")
            # Extraia os dados da missão, se disponíveis
            mission = l.get("mission", {})
            mission_description = mission.get("description")
            agency = l.get("launch_service_provider", {})
            agency_name = agency.get("name")

            # Procura pelo lançamento usando o ID da API ou nome/data
            launch = None
            if api_id:
                launch = Launch.query.filter_by(launch_id=api_id).first()
            if not launch:
                launch = Launch.query.filter_by(name=l.get("name"), net=net_dt).first()
            if launch:
                # Atualiza todos os campos, inclusive a data "net"
                launch.net = net_dt
                launch.image = image
                launch.status = status
                launch.mission_description = mission_description 
                launch.agency_name = agency_name
            else:
                launch = Launch(
                    launch_id=api_id,
                    name=l.get("name"),
                    net=net_dt,
                    image=image,
                    status=status,
                    mission_description=mission_description,
                    agency_name=agency_name
                )
                db.session.add(launch)
        db.session.commit()
    except Exception as e:
        print(f"Erro ao atualizar lançamentos: {e}")

def get_upcoming_launches(limit=10):
    try:
        update_launches(limit)
        now_utc = datetime.now(timezone.utc)
        launches = (Launch.query.filter(Launch.net > now_utc)
                                .order_by(Launch.net.asc())
                                .limit(limit)
                                .all())
        return [
            {
                'name': launch.name,
                'net': launch.net.isoformat() if launch.net else "",
                'image': launch.image,
                'status': launch.status,
                'mission': {'description': launch.mission_description},  # Inclui a missão
                'launch_service_provider': {'name': launch.agency_name}  # Inclui a agência
            }
            for launch in launches
        ]
    except Exception as e:
        print("Erro ao obter lançamentos do DB:", e)
        return []

def update_events(limit=10):
    endpoint = f"{BASE_URL}/event/upcoming/"
    params = {"limit": limit}
    try:
        response = requests.get(endpoint, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        events_data = data.get("results", [])
        for ev in events_data:
            api_id = ev.get("id")
            name = ev.get("name")
            description = ev.get("description") or ""
            image = ev.get("feature_image") or "static/images/default_event.png"
            date_str = ev.get("date")
            net_str = ev.get("net")
            date_dt = datetime.fromisoformat(date_str) if date_str else None
            net_dt = datetime.fromisoformat(net_str.replace('Z', '+00:00')) if net_str else None
            event = None
            if api_id:
                event = Event.query.filter_by(event_id=api_id).first()
            if not event:
                event = Event.query.filter_by(name=name, net=net_dt).first()
            if event:
                event.image = image
                event.description = description
            else:
                event = Event(
                    event_id=api_id,
                    name=name,
                    date=date_dt,
                    net=net_dt,
                    image=image,
                    description=description
                )
                db.session.add(event)
        db.session.commit()
    except Exception as e:
        print(f"Erro ao atualizar eventos: {e}")

def get_upcoming_events(limit=10):
    try:
        update_events(limit)
        now_utc = datetime.now(timezone.utc)
        events = (Event.query.filter(
                   or_(Event.net > now_utc, Event.date > now_utc))
                  .order_by(Event.date.asc())
                  .limit(limit)
                  .all())
        return [
            {
                'name': event.name,
                'net': event.net.isoformat() if event.net else "",
                'date': event.date.isoformat() if event.date else "",
                'image': event.image,
                'description': event.description
            }
            for event in events
        ]
    except Exception as e:
        print("Erro ao obter eventos do DB:", e)
        return []

def get_past_launches(limit=10):
    try:
        now_utc = datetime.now(timezone.utc)
        launches = (Launch.query.filter(Launch.net <= now_utc)
                                .order_by(Launch.net.desc())
                                .limit(limit)
                                .all())
        return [
            {
                'name': launch.name,
                'net': launch.net.isoformat() if launch.net else "",
                'image': launch.image,
                'status': launch.status,
                'mission': {'description': launch.mission_description},
                'launch_service_provider': {'name': launch.agency_name}
            }
            for launch in launches
        ]
    except Exception as e:
        print("Erro ao obter lançamentos passados do DB:", e)
        return []
