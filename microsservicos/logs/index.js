const express = require('express')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json())

const baseLogs = []
const eventosImportantes = [
  'LembreteCriado',
  'LembreteClassificado',
  'LembreteAtualizado',
  'ObservacaoCriada',
  'ObservacaoClassificada',
  'ObservacaoAtualizada'
]
app.post('/eventos', async (req, res) => {
  const evento = req.body
  console.log(evento)
  const idLog = uuidv4()
  const data = Date()
  const log = {id: idLog, dataHora: data, tipoEvento: evento.type, dados: evento.payload}
  baseLogs.push(log)
  res.end()
})

app.get('/logs', (req, res) => {
  res.json(baseLogs)
})

const port = 8000
app.listen(port, () => {
  console.log(`Logs. Porta ${port}.`)
  axios.post('http://localhost:10000/registrar', {porta: port, eventos: eventosImportantes})
})