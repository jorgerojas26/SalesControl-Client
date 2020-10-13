import React, { Component } from "react";
import Async from 'react-select/async';

class CustomSelect extends Component {

    constructor() {
        super();

        this.state = {
            options: []
        }

        this.searchHandler = this.searchHandler.bind(this);
    }

    roundToNiceNumber(value) {
        var val = 0;
        if (value.toString().length == 4) {
            val = Math.ceil(value / 100) * 100
        }
        else if (value.toString().length > 4) {
            val = Math.ceil(value / 1000) * 1000
        }

        return val;
    }

    searchHandler(inputValue, callback) {
        fetch(this.props.sourceURL || `/api/products?name=${inputValue}`)
            .then(result => result.json())
            .then(results => {
                if (results.data.length > 0) {
                    results.data.forEach(item => {
                        item.value = item.name;
                        if (item.imagePath) {
                            item.label = [<img className="float-left" style={{ maxWidth: "20px" }} src={item.imagePath} />, `${item.name} (${this.roundToNiceNumber(item.price * this.props.dolarReference)})`];
                        }
                        else {
                            item.label = `${item.name} (${Intl.NumberFormat("es-VE", { style: "currency", currency: "VES" }).format(this.roundToNiceNumber(item.price * this.props.dolarReference))})`
                        }
                    });
                    callback(results.data)
                }
            });
    }
    render() {
        return (
            <Async
                loadOptions={this.searchHandler}
                defaultOptions
                placeholder="Buscar"
                autoFocus
                inputId="selectedProduct"
                isMulti={this.props.isMulti}
                isClearable
                ref={this.props.innerRef}
                name={this.props.name}
                onChange={this.props.changeHandler}
                value={this.props.value}
            />
        )
    }
}

export default CustomSelect;