const BASE_URL = '/api/paymentmethods';

const functions = {
    fetchAll: async function () {
        let paymentMethods = await fetch(BASE_URL, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await paymentMethods.json();
        return response;
    },
    fetchByName: async function (name) {
        let paymentMethods = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
        });

        let response = await paymentMethods.json();

        return response;
    },
    create: async function (paymentMethod) {
        let newPaymentMethod = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentMethod),
        });

        let response = await newPaymentMethod.json();

        return response;
    },
};

export default functions;
