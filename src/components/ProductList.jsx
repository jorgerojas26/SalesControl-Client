import React, { Component } from "react";
import ContentLoader from 'react-content-loader'
import { connect } from "react-redux";
import * as actions from "../actions/productActions";
import CategoryTitle from "../components/CategoryTitle";

class ProductList extends Component {

    constructor() {
        super();

        this.observer = new IntersectionObserver(this.loadMoreProductsHandler.bind(this));
        this.elementToObserve = React.createRef();
    }

    componentDidMount() {
        this.fetchProducts(1, 16);
    }

    componentDidUpdate() {
        if (this.elementToObserve.current) {
            this.observer.observe(this.elementToObserve.current)
        }
    }

    fetchProducts(page, limit, categories = 1) {
        this.props.dispatch(actions.setLoading(true));
        fetch(`/api/products?page=${page}&limit=${limit}&categories=${categories}`)
            .then(result => result.json())
            .then(paginatedProducts => {
                paginatedProducts.data = this.props.products.concat(paginatedProducts.data);
                this.props.dispatch(actions.loadProducts(paginatedProducts));
                this.props.dispatch(actions.setLoading(false));
            });
    }

    loadMoreProductsHandler(entries) {
        if (entries[0].isIntersecting) {
            if (this.props.next) {
                this.fetchProducts(this.props.next.page, this.props.next.limit, this.props.activeCategory)
            }
        }
    }

    render() {
        if (this.props.products.length > 0) {
            let products = this.props.products.map((product, index) => {
                return (
                    <div className="col-6 col-sm-6 col-md-4 col-lg-3 p-0 pr-2 pb-2" key={index}>
                        <div className="card">
                            <img className="card-img-top productImage" src={product.imagePath} alt="Imagen del producto" />
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold overflow-hidden text-truncate text-dark">{product.name}</h5>
                                <h5 className="text-danger">Bs. {product.price}</h5>
                            </div>
                            <div className="card-footer">
                                <div className="input-group d-flex justify-content-center">
                                    <input className="form-control text-center" style={{ maxWidth: "35%" }} type="number" defaultValue="1" name="numberOfItems" id="numberOfItems" />
                                    <input className="bg-dark text-light" type="button" value="Comprar" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            });

            if (this.props.next) {
                products.push((
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 p-0 pr-2 pb-2" key="contentLoader" ref={this.elementToObserve}>
                        <ContentLoader
                            speed={1}
                            viewBox="0 0 200 400"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <rect x="0" y="6" rx="0" ry="0" width="239" height="250" />
                            <rect x="0" y="292" rx="0" ry="0" width="239" height="15" />
                            <rect x="59" y="291" rx="0" ry="0" width="2" height="0" />
                            <rect x="0" y="313" rx="0" ry="0" width="239" height="15" />
                            <rect x="0" y="361" rx="0" ry="0" width="239" height="36" />
                        </ContentLoader >
                    </div>
                ))
            }
            products.unshift(<div className="col-12">
                <CategoryTitle />
            </div>)
            return products
        }
        else if (this.props.loading) {
            return <p>Loading</p>
        }
        else {
            return <p>No hay productos</p>
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        products: state.products.data,
        next: state.products.next,
        previous: state.products.previous,
        loading: state.products.loading,
        activeCategory: state.categories.activeCategory
    }
}

export default connect(mapStateToProps)(ProductList);