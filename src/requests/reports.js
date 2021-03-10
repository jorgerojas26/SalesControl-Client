const BASE_URL = "/api/reports";

const functions = {
    salesReport: async function (startDate, endDate) {
        let report = await fetch(BASE_URL + "/sales" + `?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        let response = await report.json();

        return response;
    },
    paymentsReport: async function (startDate, endDate) {
        let report = await fetch(BASE_URL + "/sales/payments" + `?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        let response = await report.json();

        return response;
    },
    debtsReport: async function (startDate, endDate) {
        let report = await fetch(BASE_URL + "/debts" + `?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        });

        let response = await report.json();

        return response;
    }
};

export default functions;
