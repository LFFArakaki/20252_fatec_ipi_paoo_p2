import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

const eventos = {
  LembreteCriado: [],
  LembreteClassificado: [],
  LembreteAtualizado: [],
  ObservacaoCriada: [],
  ObservacaoClassificada: [],
  ObservacaoAtualizada: []
}

const mssEventos = {
  4000: [],
  5000: [],
  6000: [],
  7000: [],
  8000: [],
  9000: []
}

app.post('/registrar', async (req, res) => {
  const mss = req.body
  console.log(mss)
  mssEventos[mss.porta] = mss.eventos
  res.end()
})

app.post('/eventos', async (req, res) => {
  const evento = req.body
  eventos[evento.type].push(evento)
  console.log(evento)
  for(let eventoI of mssEventos[4000]){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:4000/eventos', evento)
      }
      catch(e){}
    }
  }
  for(let eventoI of mssEventos['5000']){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:5000/eventos', evento)
      }
      catch(e){}
    }
  }
  for(let eventoI of mssEventos['6000']){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:6000/eventos', evento)
      }
      catch(e){}
    }
  }
  for(let eventoI of mssEventos['7000']){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:7000/eventos', evento)
      }
      catch(e){}
    }
  }
  for(let eventoI of mssEventos['8000']){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:8000/eventos', evento)
      }
      catch(e){}
    }
  }
  for(let eventoI of mssEventos['9000']){
    if(eventoI === evento.type){
      try{
        await axios.post('http://localhost:9000/eventos', evento)
      }
      catch(e){}
    }
  }
  res.end()
})

app.get('/eventos', (req, res) => {
  res.json(eventos)
})

const port = 10000
app.listen(port, () => {
  console.log(`Barramento. Porta ${port}.`)
})