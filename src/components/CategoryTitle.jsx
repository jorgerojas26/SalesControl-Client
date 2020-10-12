import React, { Component } from "react";
import { connect } from "react-redux";

class CategoryTitle extends Component {

    render() {
        return (
            <h3 className="float-left text-danger mt-2">{this.props.activeCategory}</h3>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        activeCategory: state.categories.activeCategoryName
    }
}

export default connect(mapStateToProps)(CategoryTitle);