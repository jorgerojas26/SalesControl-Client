const BASE_URL = '/api/payments';

const functions = {
    fetchAll: async function () {
        let payments = await fetch(BASE_URL, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await payments.json();
        return response;
    },
    fetchById: async function (id) {
        let payment = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await payment.json();

        return response;
    },
    fetchByName: async function (name) {
        let payments = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await payments.json();

        return response;
    },
    create: async function (payment) {
        let newPayment = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment),
        });

        let response = await newPayment.json();

        return response;
    },
    update: async function (payment) {
        let response = await fetch(BASE_URL + `/${payment.id}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment),
        });

        let payments = await response.json();

        return payments;
    },
};

export default functions;
