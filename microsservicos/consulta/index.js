const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const baseConsolidada = {}
const eventosImportantes = ['ObservacaoCriada', 'LembreteCriado', 'ObservacaoClassificada', 'LembreteClassificado']
const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
  },
  LembreteClassificado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
    axios.post('http://localhost:10000/eventos', {
      type: 'LembreteAtualizado',
      payload: lembrete
    })
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoClassificada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes']
    const indice = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoAtualizada',
      payload: observacao
    })
  }
}

app.get('/lembretes', (req, res) => {
  res.json(baseConsolidada)  
})

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    const { type, payload } = evento
    funcoes[type](payload)
  }
  catch(e){}
  res.end()
})

const port = 6000
app.listen(port, async () => { 
  console.log (`Consulta. Porta ${port}.`)
  const resp = await axios.get('http://localhost:10000/eventos')
  for(let eventoI of eventosImportantes){
    for(let evento of resp.data[eventoI]){
      try{
        funcoes[evento.type](evento.payload)
      }
      catch(e){}
    }
  }
  axios.post('http://localhost:10000/registrar', {porta: port, eventos: eventosImportantes})
})