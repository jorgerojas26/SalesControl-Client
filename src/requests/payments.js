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
    fetchByDateRange: async function (from, to) {
        let payment = await fetch(BASE_URL + `?from=${from}&to=${to}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await payment.json();

        return response

    },
    fetchByCustomParameters: async function (parameters) {
        let payment = await fetch(BASE_URL + "?" + parameters, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await payment.json();

        return response

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
};

export default functions;
