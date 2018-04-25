import axios from 'axios'
const usersApi = {
  getCurrentUser (token) {
    return axios.get('http://localhost:3000/api/getCurrentUser', { headers: { token } })
      .then(response => response.data)
      .catch(() => { })
  },
  getAllUsers () {
    return axios.get('http://localhost:3000/api/getAllUsers')
      .then(response => response.data)
      .catch(() => [])
  },
  createNewUser (userData) {
    return axios.post('/api/createNewUser', userData)
      .then(response => response.data)
      .catch(e => { throw new Error(e.response.data.message) })
  }
}

export default usersApi
