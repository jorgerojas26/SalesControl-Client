import React from "react"

const ProductsTable = (props) => {


    return (
        <table className="table table-dark table-striped table-bordered overflow-auto">
            <thead>
                <tr>
                    <th className="my-auto" scope="col">
                        Product ID
                                        </th>
                    <th className="my-auto" scope="col">
                        Nombre
                                        </th>
                    <th className="my-auto" scope="col">
                        Precio Bs
                                        </th>
                    <th className="my-auto" scope="col">
                        Cantidad
                                        </th>
                    <th className="my-auto" scope="col">
                        Total <span className="font-weight-bold text-warning"> {' ' + Intl.NumberFormat('es-VE', {currency: 'VES'}).format(this.state.totalBs)} </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.productsToSell &&
                    props.productsToSell.map((product, index) => {
                        return (
                            <tr key={index} productid={product.id}>
                                <th>{product.id}</th>
                                <th>
                                    <img style={{maxWidth: '40px'}} src={product.imagePath} /> {product.name}
                                </th>
                                <th>{Intl.NumberFormat('es-VE', {currency: 'VES'}).format(product.unitPriceBs)}</th>
                                <th onClick={this.editProductQuantityHandler} className="bg-dark" data-toggle="tooltip" data-placement="bottom" title="Editar Cantidad" role="button">
                                    {product.quantity}
                                </th>
                                <th>{Intl.NumberFormat('es-VE', {currency: 'VES'}).format(product.totalBs)}</th>
                                <th>
                                    <button onClick={this.deleteFromTable} className="btn btn-danger p-0">
                                        Delete
                                                        </button>
                                </th>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    )

}

export default ProductsTable;
