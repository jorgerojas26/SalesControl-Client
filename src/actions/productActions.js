module.exports = {
    loadProducts: function (paginatedProducts) {
        return { type: "LOAD_PRODUCTS", paginatedProducts }
    },
    setLoading: function (loading) {
        return { type: "LOADING", loading }
    },
}