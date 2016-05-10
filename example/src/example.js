var React = require('react');
var ReactDOM = require('react-dom');
// var a11y = require('react-axe');
var a11y = require('../../index.js');

a11y(React, ReactDOM, 1000);
// This is more complex example that uses two components -
// a service chooser form, and the individual services inside it.

var ServiceChooser = React.createClass({
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
			return <Service name={s.name} price={s.price} active={s.active} addTotal={self.addTotal} />;
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

var Service = React.createClass({
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

var services = [
	{ name: 'Web Development', price: 300 },
	{ name: 'Design', price: 400 },
	{ name: 'Integration', price: 250 },
	{ name: 'Training', price: 220 }
];

// Render the ServiceChooser component, and pass the array of services

ReactDOM.render(
	<ServiceChooser items={ services } />,
	document.getElementById('container')
);
