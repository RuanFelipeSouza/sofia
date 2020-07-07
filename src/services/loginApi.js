import axios from 'axios';

const api = axios.create({
  baseURL: 'http://vilanova.intelliway.com.br:3030/'
});

let tokenStorage = localStorage.getItem('Authorization');

if (tokenStorage) {
  api.defaults.headers.common = {
    Authorization: tokenStorage
  };
}

export default api;