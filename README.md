Sensorik Dashboard – Docker Setup

## Voraussetzungen
- Docker
- Docker Compose

## Starten der Anwendung
Im Projektverzeichnis einfach ausführen:

```bash
docker compose up
```
Dies startet sowohl Backend als auch Frontend:

Backend ist erreichbar unter: http://localhost:8000/

Frontend ist erreichbar unter: http://localhost:3000/



✅ Mit diesem Setup wird ein voll funktionsfähiges Wasserstand-Dashboard bereitgestellt, das Sie direkt nutzen können. Die Container werden automatisch die notwendigen Datenbanken erstellen und alles für die lokale Entwicklung vorbereiten.


⚠️ Hinweis: Die Dashboards für Wetter- und Bodenfeuchtedaten werden nicht geladen, da sie eine separate InfluxDB-Verbindung benötigen, die außerhalb des Umfangs dieses Repos liegt.  
Bei Bedarf an Unterstützung bei der Umsetzung dieser Dashboards können Sie uns gerne kontaktieren.
