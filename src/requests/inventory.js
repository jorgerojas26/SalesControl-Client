const BASE_URL = "/api/inventory";

export default {
    fetchAll: async function () {
        let inventory = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await inventory.json();

        return response;
    },
    fetchByProductId: async function (productId) {
        let inventory = await fetch(BASE_URL + `?id=${productId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await inventory.json();

        return response;
    },
    fetchByProductName: async function (name) {
        let inventory = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await inventory.json();

        return response;
    }
}

