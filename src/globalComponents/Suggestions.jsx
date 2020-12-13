import React, { Component } from "react";

class Suggestions extends Component {

    render() {
        if (this.props.noResults) {
            return (
                <ul className="list-group position-absolute w-100" >
                    <li className="list-group-item text-justify">No se encontraron resultados</li>
                </ul>
            )
        }
        else {
            return (
                <ul className="list-group position-absolute w-100 suggestionsBox" >
                    {this.props.suggestions.map(suggestion => {
                        if (this.props.onlyName) {
                            return <div onClick={this.props.clickHandler} key={suggestion.id} productid={suggestion.id} className="text-justify">
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-1">
                                            <img style={{ maxWidth: "35px" }} src={suggestion.imagePath} alt="IMG" />
                                        </div>
                                        <div className="col-6 float-left">
                                            <h5 className="font-weight-bold" id="productName">{suggestion.name}</h5>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        }
                        else {
                            return <li onClick={this.props.clickHandler} key={suggestion.id} className="list-group-item text-justify">
                                <div className="row">
                                    <div className="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-6">
                                        <img className="" style={{ maxWidth: "35px" }} src={suggestion.imagePath} alt="IMG" />
                                        <span id="productName font-weight-bold">{suggestion.name}</span>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-6 col-lg-6 col-xl-4">
                                        <div className="input-group ">
                                            <input className="form-control text-center" style={{ minWidth: "45px", maxWidth: "70px" }} type="number" defaultValue="1" name="numberOfItems" id="numberOfItems" />
                                            <input className="bg-dark text-light" type="button" value="Comprar" />
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-2 col-md-6 col-lg-6 col-xl-2 ">
                                        <span className="text-danger">{`${suggestion.price} Bs.`}</span>
                                    </div>
                                </div>
                            </li>
                        }
                    })}
                </ul>
            )
        }
    }
}

export default Suggestions