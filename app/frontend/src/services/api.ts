import axios from 'axios'

const api = axios.create({
  // URL do seu container Node (ajuste se a porta for diferente de 3000)
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api