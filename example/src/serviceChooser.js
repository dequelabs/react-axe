var React = require('react');
var ReactDOM = require('react-dom');

if (process.env.NODE_ENV !== 'production') {
    var axe = require('../../index.js');
    axe(React, ReactDOM, 1000);
}

var Service = require('./service');

module.exports = React.createClass({
    getInitialState: function(){
        return { total: 0 };
    },
    addTotal: function( price ){
        this.setState( { total: this.state.total + price } );
    },
    render: function() {
        var self = this;
        var services = this.props.items.map(function(s){
            // Create a new Service component for each item in the items array.
            // Notice that I pass the self.addTotal function to the component.
            return <Service key={s.name} name={s.name} price={s.price} active={s.active} addTotal={self.addTotal} />;
        });
        return <div>
        <h1>Our services</h1>
        <div id="services">
            {services}
            <p id="total">Total <b>${this.state.total.toFixed(2)}</b></p>
            </div>
            </div>;
    }
});
