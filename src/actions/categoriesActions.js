module.exports = {
    loadCategories: function (categories) {
        return { type: "LOAD_CATEGORIES", categories }
    },
    setActiveCategoryId: function (categoryId) {
        return { type: "SET_ACTIVE_CATEGORY_ID", categoryId }
    },
    setActiveCategoryName: function (categoryName) {
        return { type: "SET_ACTIVE_CATEGORY_NAME", categoryName }
    }
}