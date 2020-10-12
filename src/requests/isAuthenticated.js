module.exports = {
    /*
    isAuthenticated: async function () {
        let token = localStorage.getItem("jwt");
        let response = await fetch(`/sessions/isAuthenticated?token=${token}`);
        let jsonResponse = await response.json();
        return jsonResponse.auth;
    }
    */

    isAuthenticated: async function () {
        let token = localStorage.getItem("jwt");
        if (!token) return false;
        return fetch(`/sessions/isAuthenticated?token=${token}`)
            .then(res => res.json())
            .then(res => {
                return res.auth;
            });
    }
}