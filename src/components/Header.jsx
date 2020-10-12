import React, { Component } from "react";
import SearchInput from "../globalComponents/SearchInput";

class Header extends Component {

    constructor(props) {
        super(props);

        this.headerContainer = React.createRef();
        this.scrollHandler = this.scrollHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollHandler);
    }

    scrollHandler() {
        if (window.scrollY > 100) {
            this.headerContainer.current.parentElement.style.backgroundColor = "#3c4055";
            this.headerContainer.current.parentElement.style.outlineStyle = "solid";
            this.headerContainer.current.parentElement.style.outlineWidth = "2px";
            //this.headerContainer.current.querySelector("#brand-title").classList.replace("text-danger", "text-light")
        }
        else {
            this.headerContainer.current.parentElement.style.backgroundColor = "white";
            this.headerContainer.current.parentElement.style.outlineStyle = "none";
            //this.headerContainer.current.querySelector("#brand-title").classList.replace("text-light", "text-danger")
        }
    }

    render() {
        return (
            <div ref={this.headerContainer} className="row">
                <div className="col-12 col-lg-5 brand-image-container">
                    <div className="brand-image h-100" />
                </div>
                <SearchInput parentClassName={"col-10 col-lg-4 my-auto"} className={"form-control"} />
                <div className="col-1 d-flex">
                    <img className="align-items-middle mx-auto" src="/icons/shopping-cart.svg" alt="Shopping Cart" />
                </div>
            </div >
        )
    }
}

export default Header;