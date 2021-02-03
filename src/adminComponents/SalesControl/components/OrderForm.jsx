import React from "react"

import ProductSearch from "../containers/ProductSearchContainer"

const OrderForm = (props) => {
    return (
        <div>
            <div className="row">
                <div className="col-12 col-lg-7 mt-2">
                    <label className="font-weight-bold">Productos</label>
                </div>
                <div className="col-12 col-lg-3 mt-2">
                    <label className="font-weight-bold">Cantidad</label>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <form onSubmit={props.onProductSubmit}>
                        <div className="row">
                            <div className="col-12 col-lg-7 mt-2">
                                <ProductSearch
                                    productSelectRef={props.productSelectRef}
                                    dolarReference={props.dolarReference}
                                    currentSelectedProduct={props.currentSelectedProduct}
                                    onProductSelect={props.onProductSelect} />
                            </div>
                            <div className="col-12 col-lg-3 mt-2">
                                <input ref={props.quantityInputRef} onChange={props.onChangeHandler} type="number" min="0.001" step="0.001" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
                            </div>
                            <div className="col-12 col-lg-2 mt-2">
                                <input type="submit" className="form-control btn btn-info" value="Enviar" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default OrderForm;
