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

    searchHandler(inputValue, callback) {
        fetch(this.props.sourceURL || `/api/products?name=${inputValue}`)
            .then(result => result.json())
            .then(results => {
                if (results.data.length > 0) {
                    results.data.forEach(item => {
                        item.value = item.name;
                        if (item.imagePath) {
                            item.label = [<img className="float-left" style={{ maxWidth: "20px" }} src={item.imagePath} alt="IMG" />, item.name];
                        }
                        else {
                            item.label = item.name
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