#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "POCO X3 NFC";
const char* password = "0987654321";

TinyGPSPlus gps;
HardwareSerial gpsSerial(2);
WebServer server(80);

String lastLat = "0.000000";
String lastLng = "0.000000";

void handleCoords() {
  // CORS habilitado para que tu página web externa pueda leer estos datos
  server.sendHeader("Access-Control-Allow-Origin", "*");
  String json = "{\"lat\":\"" + lastLat + "\",\"lng\":\"" + lastLng + "\"}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  server.on("/coords", handleCoords);
  server.begin();
  Serial.println("IP asignada por el router: " + WiFi.localIP().toString());
}

void loop() {
  server.handleClient();
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      if (gps.location.isValid()) {
        lastLat = String(gps.location.lat(), 6);
        lastLng = String(gps.location.lng(), 6);
      }
    }
  }
}