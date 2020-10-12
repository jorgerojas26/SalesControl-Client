import React, { Component } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import Suggestions from "./Suggestions";
import debounce from "lodash.debounce";

class SearchInput extends Component {

    constructor() {
        super()

        this.state = {
            showSuggestions: false,
            suggestions: [],
            noResults: false
        };

        this.searchHandler = debounce(this.searchHandler, 500);
        this.headerContainer = React.createRef();
        this.onBlurHandler = this.onBlurHandler.bind(this);
    }

    searchHandler(event) {
        if (event.target.value.length > 0) {
            fetch(`/api/products?name=${event.target.value}&page=1&limit=10`)
                .then(result => result.json())
                .then(result => {
                    if (result.data.length > 0) {
                        this.setState({
                            showSuggestions: true,
                            suggestions: result.data,
                            noResults: false
                        });
                    }
                    else {
                        this.setState({
                            showSuggestions: true,
                            noResults: true
                        });
                    }

                });
        }
        else {
            this.setState({
                showSuggestions: false,
                suggestions: []
            })
        }
    }
    onBlurHandler() {
        this.setState({
            showSuggestions: false
        });
    }

    render() {
        return (
            <div className={this.props.parentClassName}>
                <input onChange={event => {
                    event.persist();
                    this.searchHandler(event);
                }} className={this.props.className} type="text" placeholder="Buscar Producto" id="searchInput" />
                <div ref={this.suggestionBox} className="">
                    {this.state.showSuggestions &&
                        <OutsideClickHandler
                            onOutsideClick={this.onBlurHandler}><Suggestions suggestions={this.state.suggestions} noResults={this.state.noResults} clickHandler={this.props.clickHandler} onlyName={this.props.onlyName}></Suggestions>
                        </OutsideClickHandler>}
                </div>
            </div>

        )
    }
}

export default SearchInput;