import axios from 'axios';

const api = axios.create({
    baseURL: 'http://globaltouch-01.intelliway.com.br:3005'
});

let tokenStorage = sessionStorage.getItem('Authorization');

if (tokenStorage) {
    instance.defaults.headers.common = {
        Authorization: tokenStorage
    };
}

export default api;