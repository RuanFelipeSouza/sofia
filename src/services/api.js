import axios from 'axios';

const api = axios.create({
    baseURL: 'https://arcelorsup.intelliway.com.br:3002'
});

let tokenStorage = localStorage.getItem('Authorization');

if (tokenStorage) {
    api.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;