import React from 'react';
import createReactClass from 'create-react-class';

module.exports = createReactClass({
    getInitialState: function(){
        return { active: false };
    },
    clickHandler: function (){
        var active = !this.state.active;

        this.setState({ active: active });
        // Notify the ServiceChooser, by calling its addTotal method
        this.props.addTotal( active ? this.props.price : -this.props.price );
    },
    render: function(){
        return  <p className={ this.state.active ? 'active' : '' } onClick={this.clickHandler}>
        {this.props.name} <b>${this.props.price.toFixed(2)}</b>
        </p>;
    }
});
