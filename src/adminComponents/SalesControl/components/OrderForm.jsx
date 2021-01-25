import React from "react"

import ProductSearch from "../containers/ProductSearch"

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
                    <form onSubmit={props.onSubmitHandler}>
                        <div className="row">
                            <div className="col-12 col-lg-7 mt-2">
                                <ProductSearch />
                            </div>
                            <div className="col-12 col-lg-3 mt-2">
                                <input onChange={props.onChangeHandler} type="number" step="0.001" className="form-control" placeholder="Cantidad" id="quantity" name="quantity" defaultValue="1" />
                            </div>
                            <div addProduct="col-12 col-lg-2 mt-2">
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
