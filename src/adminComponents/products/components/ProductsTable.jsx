import React from "react";

const ProductsTable = (props) => {
    let productsTotal = 0;

    props.products.map(product => {
        productsTotal += product.totalBs;
    });

    return (
        <table className={`table table-dark table-striped table-bordered table-sm overflow-auto ${(props.fontSize && props.fontSize == "small") ? "h6" : "h4"}`}>
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
                        Total <span className="text-danger font-weight-bold">{productsTotal.toLocaleString("es-VE")}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.products.length > 0 &&
                    props.products.map((product, index) => {
                        return (
                            <tr key={index} productid={product.id}>
                                <th>{product.id}</th>
                                <th>
                                    <img style={{ maxWidth: '40px' }} src={product.imagePath} /> {product.name}
                                </th>
                                <th>{Intl.NumberFormat('es-VE', { currency: 'VES' }).format(product.unitPriceBs)}</th>
                                <th onClick={props.editProductQuantityHandler} className="bg-dark" data-toggle="tooltip" data-placement="bottom" title="Editar Cantidad" role="button">
                                    {product.quantity}
                                </th>
                                <th>{Intl.NumberFormat('es-VE', { currency: 'VES' }).format(product.totalBs)}</th>
                                <th>
                                    <button onClick={props.onProductDelete} className="btn btn-danger p-0"> Delete </button>
                                </th>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );

};

export default ProductsTable;