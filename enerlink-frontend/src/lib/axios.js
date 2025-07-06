import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://enerlink.onrender.com', // or whatever your prefix is
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
