import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'
});

let tokenStorage = localStorage.getItem('Authorization');

if (tokenStorage) {
    api.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;