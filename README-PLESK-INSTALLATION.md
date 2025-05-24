# Plesk-Installationsanleitung für die Bewerbungsportal-App

## Voraussetzungen
- Plesk-Webhosting mit PHP-Unterstützung
- FTP-Zugang zu Ihrem Webhosting
- Domain konfiguriert in Plesk

## Installationsschritte

### 1. Dateien hochladen
1. Verbinden Sie sich über FTP mit Ihrem Webhosting
2. Navigieren Sie zum Hauptverzeichnis Ihrer Website (in der Regel "httpdocs" oder "htdocs")
3. Laden Sie die folgenden Dateien hoch:
   - Den gesamten Inhalt des `dist`-Ordners
   - Die `.htaccess`-Datei
   - Die `robots.txt`-Datei

### 2. Überprüfen Sie die Servereinstellungen
1. Stellen Sie sicher, dass in Plesk "Datei und Verzeichnisumschreibungen (mod_rewrite)" aktiviert ist:
   - Öffnen Sie Plesk Control Panel
   - Wählen Sie Ihre Domain
   - Gehen Sie zu "Webserver-Einstellungen"
   - Aktivieren Sie das Kontrollkästchen für "Datei und Verzeichnisumschreibungen (mod_rewrite)"

### 3. HTTPS konfigurieren (empfohlen)
1. In Plesk:
   - Wählen Sie Ihre Domain
   - Gehen Sie zu "SSL/TLS-Zertifikate"
   - Installieren Sie ein SSL-Zertifikat (Let's Encrypt ist kostenlos verfügbar)

### 4. Testen Sie die Installation
1. Öffnen Sie Ihre Website im Browser
2. Überprüfen Sie, ob alle Seiten korrekt geladen werden
3. Testen Sie die Navigation und Anmeldefunktion

## Fehlersuche

### Problem: Weiße Seite nach dem Hochladen
- Überprüfen Sie die Browser-Konsole (F12) auf JavaScript-Fehler
- Stellen Sie sicher, dass alle Dateien aus dem dist-Ordner hochgeladen wurden

### Problem: 404-Fehler bei Routen
- Überprüfen Sie, ob die .htaccess-Datei korrekt hochgeladen wurde
- Stellen Sie sicher, dass mod_rewrite auf dem Server aktiviert ist

### Problem: Fehler bei API-Anfragen
- Überprüfen Sie, ob die Anwendung auf API-Endpoints zugreift, die auf dem Server nicht verfügbar sind

## Support

Bei Fragen wenden Sie sich bitte an den Entwickler.