
const BASE_URL = "/api/sales";

const functions = {
    fetchAll: async function () {
        let sales = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await sales.json();

        return response;
    },
    fetchById: async function (id) {
        let sale = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await sale.json();

        return response;
    },
    create: async function (sale) {
        let newSale = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sale)
        })

        let response = await newSale.json();

        return response;
    },
}

export default functions