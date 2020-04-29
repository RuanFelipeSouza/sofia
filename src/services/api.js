import axios from 'axios';

const api = axios.create({
    baseURL: 'https://globaltouch-01.intelliway.com.br:3004'
});

let tokenStorage = sessionStorage.getItem('Authorization');

if (tokenStorage) {
    api.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;