const BASE_URL = '/api/banks';

const functions = {
    fetchAll: async function () {
        let banks = await fetch(BASE_URL, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await banks.json();
        return response;
    },
    fetchById: async function (id) {
        let bank = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await bank.json();

        return response;
    },
    fetchByName: async function (name) {
        let banks = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await banks.json();

        return response;
    },
    create: async function (bank) {
        let newBank = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bank),
        });

        let response = await newBank.json();

        return response;
    },
    update: async function (bank) {
        let response = await fetch(BASE_URL + `/${bank.id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bank),
        });

        let banks = await response.json();

        return banks;
    },
};

export default functions;
