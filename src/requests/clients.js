const BASE_URL = '/api/clients';

const functions = {
    fetchAll: async function () {
        let clients = await fetch(BASE_URL, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await clients.json();
        return response;
    },
    fetchById: async function (id) {
        let client = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await client.json();

        return response;
    },
    fetchByNameWithDebts: async function (name) {
        let client = await fetch(BASE_URL + `?name=${name}&withDebts=true`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await client.json();

        return response;
    },
    fetchByName: async function (name) {
        let clients = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await clients.json();

        return response;
    },
    create: async function (client) {
        let newClient = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });

        let response = await newClient.json();

        return response;
    },
    update: async function (client) {
        let response = await fetch(BASE_URL + `/${client.id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });

        let clients = await response.json();

        return clients;
    },
};

export default functions;
