import React from "react";

import AsyncSelect from 'react-select/async-creatable';

const ClientSearch = (props) => {
    return (
        <div className="container-fluid p-0">
            <AsyncSelect
                loadOptions={props.onSearch}
                ref={props.clientSelectRef}
                onInputChange={props.onInputChange}
                className="w-100"
                placeholder="Buscar cliente"
                isClearable
                inputId="clientSelect"
                value={props.value}
                onChange={props.onClientSelect}
                styles={{
                    singleValue: (styles, { data }) => ({
                        ...styles,
                        width: '100%',
                    }),
                }}
            />

        </div>
    );
};

export default ClientSearch;
