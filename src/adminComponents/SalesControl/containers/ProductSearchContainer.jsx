import React, {Component} from "react"

import ProductSearch from "../components/ProductSearch"

import inventoryRequests from "../../../requests/inventory"

import {roundUpProductPrice} from "../../../helpers"

class ProductSearchContainer extends Component {

    constructor() {
        super();

        this.state = {
            selectedProduct: null
        }


        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSearchHandler = this.onSearchHandler.bind(this);
    }


    onChangeHandler(selectedProduct, action) {
        if (action.action === "select-option") {
            this.props.onProductSelect(selectedProduct, action);
        }
        this.setState({
            selectedProduct
        })
    }

    async onSearchHandler(inputValue) {
        let results = await inventoryRequests.fetchByProductName(inputValue);
        if (results.data.length > 0) {
            results.data.forEach(product => {
                product.label = (
                    <div className="row">
                        <div className="mx-auto">
                            <img className="my-auto" style={{maxWidth: '40px'}} src={product.imagePath} />
                            <span className="my-auto">{product.name}</span>
                        </div>
                        <span className="my-auto mr-5">
                            {Intl.NumberFormat('es-VE', {
                                currency: 'VES',
                            }).format(roundUpProductPrice(product.price * this.props.dolarReference))}
                        </span>
                    </div>
                );
                if (product.stock == 0) product.isDisabled = true;
            });
        }
        return results.data;
    }

    render() {
        return (
            <ProductSearch
                innerRef={this.props.productSelectRef}
                onChangeHandler={this.onChangeHandler}
                onSearchHandler={this.onSearchHandler}
                currentSelectedProduct={this.props.currentSelectedProduct}
            />
        )
    }
}

export default ProductSearchContainer;
