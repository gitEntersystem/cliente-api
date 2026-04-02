// Carrega variáveis do .env
require('dotenv').config()

// Importa o Express (servidor)
const express = require('express')

// Importa o cliente do Supabase
const { createClient } = require('@supabase/supabase-js')

// Importa CORS (permite acesso externo depois)
const cors = require('cors')

// Cria app
const app = express() 

// Permite JSON
app.use(express.json()) 

// Libera acesso externo
app.use(cors())

// Porta
const PORT = process.env.PORT || 3000

// Conecta no Supabase usando as variáveis do .env
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis do Supabase não definidas')
  process.exit(1)
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─────────────────────────────────────────────
// ROTA TESTE
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('API rodando 🚀')
})

// ─────────────────────────────────────────────
// LISTAR CLIENTES
// ─────────────────────────────────────────────
app.get('/clientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')

    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// ─────────────────────────────────────────────
// INSERIR CLIENTE
// ─────────────────────────────────────────────
app.post('/clientes', async (req, res) => {
  const { nome, email } = req.body

  try {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ nome, email }])
      .select()

    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// ─────────────────────────────────────────────
// INICIAR SERVIDOR
// ─────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})