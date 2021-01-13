const BASE_URL = '/api/pointofsales';

const functions = {
    fetchAll: async function () {
        let pointofsales = await fetch(BASE_URL, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await pointofsales.json();
        return response;
    },
    fetchById: async function (id) {
        let pointofsale = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await pointofsale.json();

        return response;
    },
    fetchByName: async function (name) {
        let pointofsales = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await pointofsales.json();

        return response;
    },
    fetchLastOne: async function () {
        let pointofsales = await fetch(BASE_URL + `?page=1&limit=1&order=desc`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await pointofsales.json();

        return response;
    },
    create: async function (pointofsale) {
        let newpointofsale = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pointofsale),
        });

        let response = await newpointofsale.json();

        return response;
    },
    update: async function (pointofsale) {
        let response = await fetch(BASE_URL + `/${pointofsale.id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pointofsale),
        });

        let pointofsales = await response.json();

        return pointofsales;
    },
};

export default functions;
