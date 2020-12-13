import React, { Component } from "react";
import { connect } from "react-redux";
import * as productActions from "../actions/productActions";
import * as categoriesActions from "../actions/categoriesActions";

class ProductCategories extends Component {

    constructor() {
        super();

        this.fetchProducts = this.fetchProducts.bind(this);
        this.categoryHandler = this.categoryHandler.bind(this);
    }
    componentDidMount() {
        fetch("/api/categories")
            .then(categories => categories.json())
            .then(categories => {
                if (categories.data.length > 0) {
                    this.props.dispatch(categoriesActions.loadCategories(categories.data))
                    this.props.dispatch(categoriesActions.setActiveCategoryId(document.querySelector(".categoryItem, active").getAttribute("categoryId")))
                    this.props.dispatch(categoriesActions.setActiveCategoryName(document.querySelector(".categoryItem, active").innerText));
                }
            });

    }

    categoryHandler(event) {
        event.preventDefault();
        if (!event.target.className.includes("active")) {
            event.target.parentElement.querySelector(".active").classList.remove("active");
            event.target.classList.add("active");
            this.props.dispatch(categoriesActions.setActiveCategoryId(event.target.getAttribute("categoryid")))
            this.props.dispatch(categoriesActions.setActiveCategoryName(event.target.innerText))
            this.fetchProducts(1, 16, event.target.getAttribute("categoryid"))
        }
    }

    fetchProducts(page, limit, categories) {
        this.props.dispatch(productActions.setLoading(true));
        fetch(`/api/products?page=${page}&limit=${limit}&categories=${categories}`)
            .then(result => result.json())
            .then(paginatedProducts => {
                this.props.dispatch(productActions.loadProducts(paginatedProducts));
                this.props.dispatch(productActions.setLoading(false));
            });
    }

    render() {
        return (
            <div className="col-xs-6 col-sm-12 col-md-12 p-0 mt-0 mt-md-5 productcategoriesContainer">
                <div className="card rounded-0">
                    <div className="card-header">
                        <h5 className="card-title text-danger font-weight-bold">Categorias</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="list-group">
                            {
                                this.props.categories ?
                                    this.props.categories.map((category, index) => {
                                        if (index === 0) {
                                            return <li onClick={this.categoryHandler} categoryid={category.id} key={category.id} className="categoryItem list-group-item active btn">{category.name}</li>
                                        }
                                        else {
                                            return <li onClick={this.categoryHandler} categoryid={category.id} key={category.id} className="categoryItem list-group-item btn">{category.name}</li>
                                        }
                                    })
                                    :
                                    <span>No hay categorias</span>
                            }
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        categories: state.categories.data,
        activeCategory: state.categories.activeCategory
    }
}
export default connect(mapStateToProps)(ProductCategories);