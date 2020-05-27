import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005'
});

let tokenStorage = localStorage.getItem('Authorization');

if (tokenStorage) {
  api.defaults.headers.common = {
    Authorization: tokenStorage
  };
}

export default api;