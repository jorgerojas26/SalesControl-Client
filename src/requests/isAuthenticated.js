async function isAuthenticated() {
    let token = localStorage.getItem("jwt");
    if (!token) return false;
    return fetch(`/sessions/isAuthenticated?token=${token}`)
        .then(res => res.json())
        .then(res => {
            return res.auth;
        });
}

export default isAuthenticated