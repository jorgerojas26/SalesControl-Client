const BASE_URL = "/api/debts";

const functions = {
    fetchAll: async function () {
        let debts = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await debts.json();

        return response;
    },
    fetchById: async function (id) {
        let debt = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await debt.json();

        return response;
    },
    fetchByName: async function (name) {
        let debts = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await debts.json();

        return response;
    },
    create: async function (debt) {
        let newDebt = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(debt)
        })

        let response = await newDebt.json();

        return response;
    },
    update: async function (debt) {
        let newDebt = await fetch(BASE_URL + `/${debt.id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(debt)
        })

        let response = await newDebt.json();

        return response;
    }
}

export default functions