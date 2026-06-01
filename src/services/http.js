import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common.Accept = 'application/json'

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common.Authorization
  }
}

export default axios
