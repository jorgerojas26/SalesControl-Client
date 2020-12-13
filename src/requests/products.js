const BASE_URL = "/api/products";

module.exports = {
    fetchAll: async function () {
        let response = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let products = await response.json();

        return products;
    },
    fetchById: async function (id) {
        let response = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let products = response.json();

        return products;
    },
    fetchByName: async function (name) {
        let response = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let products = response.json();

        return products;
    }

}