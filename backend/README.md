# Backend de SA - Descarga de Combustible

Este backend guarda el historial en un archivo JSON compartido para que varias personas puedan acceder a la misma información desde el mismo servidor.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
cd backend
npm install
```

## Ejecutar

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

## Endpoints

- `GET /api/health` → verifica que el backend esté activo.
- `GET /api/historial` → devuelve todo el historial.
- `POST /api/historial` → reemplaza el historial completo con un arreglo.
- `POST /api/registro` → agrega un registro individual.
- `DELETE /api/historial/:index` → elimina un registro por índice.
- `DELETE /api/historial` → limpia todo el historial.

## Ejemplo de uso con cURL

```bash
curl http://localhost:3001/api/historial
```

```bash
curl -X POST http://localhost:3001/api/registro \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "20/10/2026 10:30",
    "auto": true,
    "filas": [
      {
        "tk": "1",
        "producto": "SUPER",
        "fecha": "2026-10-20",
        "horario": "10:30",
        "temperatura": "35",
        "patente": "ABC123",
        "chofer": "Juan",
        "litrosConvertidos": "2500",
        "fusionAntes": "100",
        "varillaAntes": "90",
        "litrosDescargados": "1500",
        "fusionDespues": "80",
        "varillaDespues": "70",
        "diferenciaFusion": "-20",
        "diferenciaVarilla": "-20",
        "recepciona": "Si"
      }
    ]
  }'
```

## Importante

Este backend corre en un servidor propio. GitHub Pages no puede guardar datos entre usuarios porque no tiene base de datos ni backend. Para que todas las personas compartan el mismo historial, el backend debe estar levantado en un servidor (ej. Render, Railway, Vercel, VPS, etc.).
