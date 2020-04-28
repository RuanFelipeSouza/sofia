import axios from 'axios';

const api = axios.create({
    baseURL: 'http://arcelorsup.intelliway.com.br:3001'
});

let tokenStorage = sessionStorage.getItem('Authorization');

if (tokenStorage) {
    api.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;