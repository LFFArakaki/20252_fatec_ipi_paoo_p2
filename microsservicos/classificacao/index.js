import express from 'express'
import axios from 'axios'
const app = express()

app.use(express.json())
const palavraChave = 'importante'
const eventosImportantes = ['ObservacaoCriada', 'LembreteCriado']
const funcoes = {
  ObservacaoCriada: (observacao) => {
    if(observacao.texto.includes(palavraChave))
      observacao.status = 'importante'
    else
      observacao.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: observacao
    })
  },
  LembreteCriado: (lembrete) => {
    if(lembrete.texto.length >= 50)
      lembrete.status = 'importante'
    else
      lembrete.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'LembreteClassificado',
      payload: lembrete
    })
  }
}

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){}
  res.end()
})

const port = 7000
app.listen(port, async () => {
  console.log(`Classificação. Porta ${port}.`)
  axios.get('http://localhost:10000/eventos').then(({data: eventos}) => {
    for(let eventoI of eventosImportantes){
      for(let evento of eventos[eventoI]){
        try{
          funcoes[evento.type](evento.payload)
        }
        catch(e){}
      }
    }
  })
  axios.post('http://localhost:10000/registrar', {porta: port, eventos: eventosImportantes})
})