const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

const eventosImportantes = ['ObservacaoClassificada', 'LembreteClassificado']
const estatisticas = {
  totalLembretes: 0,
  lembretesComuns: 0,
  lembretesImportantes: 0,
  totalObservacoes: 0,
  somaCaracteresObservacoes: 0,
  mediaCaracteresObservacoes: 0
}
 
const funcoes = {
  LembreteClassificado: (lembrete) => {
    estatisticas.totalLembretes++ 
    if (lembrete.status === 'importante') {
      estatisticas.lembretesImportantes++
    } else {
      estatisticas.lembretesComuns++
    }
  },
 
  ObservacaoClassificada: (observacao) => {
    estatisticas.totalObservacoes++
    estatisticas.somaCaracteresObservacoes += observacao.texto.length
    estatisticas.mediaCaracteresObservacoes =
    estatisticas.somaCaracteresObservacoes / estatisticas.totalObservacoes
  }
}
 
app.get('/estatistica', (req, res) => {
  res.json(estatisticas)
})
 
// Endpoint para receber eventos
app.post('/eventos', (req, res) => {
  try {
    const evento = req.body
    console.log('Evento recebido:', evento)
    funcoes[evento.type](evento.payload)
  } catch (e) {
  }
  res.end()
})
 
const port = 9000
app.listen(port, () => {
  console.log(`Estatística. Porta ${port}.`)
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