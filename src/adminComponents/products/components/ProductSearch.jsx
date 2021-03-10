import React from "react";

import AsyncSelect from 'react-select/async';

const ProductSearch = (props) => {
    return (
        <div>
            <AsyncSelect
                loadOptions={props.onSearchHandler}
                value={props.currentSelectedProduct}
                ref={props.innerRef}
                onFocus={props.onFocus}
                isClearable
                autoFocus
                placeholder="Buscar producto"
                onChange={props.onChangeHandler}
                styles={{
                    option: (styles, { data }) => ({
                        ...styles,
                        color: data.stock > 0 && data.stock <= 10 ? 'orange' : data.stock > 0 ? 'green' : 'red',
                        cursor: data.stock <= 0 ? 'not-allowed' : 'pointer',
                    }),
                    singleValue: (styles) => ({
                        ...styles,
                        width: '100%',
                    }),
                }}
            />

        </div>
    );
};

export default ProductSearch;
