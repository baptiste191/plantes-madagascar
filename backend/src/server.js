// backend/src/server.js
const app = require('./index')       // <-- ici, pas './src/index'
const PORT = process.env.PORT || 3000

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
