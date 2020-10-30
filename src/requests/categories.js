const BASE_URL = "/api/categories";
const authorizationHeader = "Bearer " + localStorage.getItem("jwt");

const functions = {
    fetchAll: async function () {
        let response = await fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let categories = await response.json();

        return categories;
    },
    fetchById: async function (id) {
        let response = await fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let categories = await response.json();

        return categories;
    },
    fetchByName: async function (name) {
        let response = await fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })

        let categories = await response.json();

        return categories;
    },
    create: async function (category) {
        let response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(category)
        })

        let categories = await response.json();

        return categories;
    },
    edit: async function (category) {
        let response = await fetch(BASE_URL + `/${category.id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: category.name })
        })

        let categories = await response.json();

        return categories;
    }
}

export default functions