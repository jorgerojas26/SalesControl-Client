import React, { Component } from "react";

class BackToTopButton extends Component {
    constructor() {
        super()
        this.backToTopButton = React.createRef();

        this.state = {
            show: false
        }

        this.scrollHandler = this.scrollHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollHandler)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
    }
    scrollHandler() {
        if (window.scrollY > 100) {
            this.setState({
                show: true
            });
        }
        else {
            this.setState({
                show: false
            });
        }
    }

    clickHandler() {
        window.scrollTo(0, 0);
    }
    render() {
        return this.state.show && <button ref={this.backToTopButton} onClick={this.clickHandler} id="back-to-top" className="btn btn-secondary btn-lg back-to-top">Back to Top</button>
    }
}

export default BackToTopButton