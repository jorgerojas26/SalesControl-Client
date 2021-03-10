import React from "react"

import AsyncSelect from 'react-select/async';

const ClientSearch = (props) => {
    return (
        <div className="container-fluid p-0">
            <AsyncSelect
                loadOptions={props.onSearch}
                autoFocus
                ref={props.clientSelectRef}
                className="w-100"
                placeholder="Buscar cliente"
                isClearable
                inputId="clientSelect"
                value={props.value}
                onChange={props.onClientSelect}
                styles={{
                    singleValue: (styles, {data}) => ({
                        ...styles,
                        width: '100%',
                    }),
                }}
            />

        </div>
    )
}

export default ClientSearch;