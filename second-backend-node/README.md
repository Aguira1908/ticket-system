# Ticket Stats API

Backend API untuk menghitung statistik dari data support ticket.

Dibangun dengan **Express 5** + **TypeScript**.

## Fitur

- Menghitung total tiket
- Menghitung jumlah tiket per status (`open`, `in_progress`, `resolved`)
- Menghitung rata-rata respons per tiket
- Menghitung persentase resolusi tiket

## Tech Stack

- Node.js
- Express 5
- TypeScript
- tsx (dev runner)

## Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Jalankan mode development

```bash
npm run dev
```

Server berjalan di `http://localhost:4000`.

### 3. Build untuk production

```bash
npm run build
npm start
```

## API Endpoint

### `GET /api/stats`

Mengembalikan statistik tiket dalam format JSON.

**Contoh Response:**

```json
{
  "total": 18,
  "by_status": {
    "open": 6,
    "in_progress": 6,
    "resolved": 6
  },
  "average_responses_per_ticket": 1.39,
  "resolution_rate_percent": 33.33
}
```

## Struktur Folder

```
src/
├── controllers/    # Menghandle request & response
├── data/           # Data contoh (JSON)
├── middlewares/     # Error handler
├── routes/         # Definisi route
├── services/       # Logika bisnis (perhitungan statistik)
├── types/          # TypeScript type definitions
├── app.ts          # Setup Express app
└── server.ts       # Entry point server
```
