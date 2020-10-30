const BASE_URL = "/api/products";

module.exports = {
    fetchAll: function () {
        return fetch(BASE_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
    },
    fetchById: function (id) {
        return fetch(BASE_URL + `?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
    },
    fetchByName: function (name) {
        return fetch(BASE_URL + `?name=${name}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
    }

}