// backend/src/server.js
require('dotenv').config();

const express = require('express')
const app     = express()
const required = ['DB_FILE','JWT_SECRET'];

for (let v of required) {
  if (!process.env[v]) {
    console.error(`❌ La variable ${v} n’est pas définie dans .env`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
