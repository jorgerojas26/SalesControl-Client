const BASE_URL = "/api/categories";

const functions = {
    fetchAll: async function () {
        let categories = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await categories.json();

        return response;
    },
    fetchById: async function (id) {
        let category = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await category.json();

        return response;
    },
    fetchByName: async function (name) {
        let categories = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let response = await categories.json();

        return response;
    },
    create: async function (category) {
        let newCategory = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })

        let response = await newCategory.json();

        return response;
    },
    update: async function (category) {
        let newCategory = await fetch(BASE_URL + `/${category.id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify()
        })

        let response = await newCategory.json();

        return response;
    }
}

export default functions