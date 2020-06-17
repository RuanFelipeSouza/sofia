import axios from 'axios';

const api = axios.create({
    baseURL: 'http://whatsapp2.intelliway.com.br:3005'
});

let tokenStorage = sessionStorage.getItem('Authorization');

if (tokenStorage) {
    api.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;
