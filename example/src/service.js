import React from 'react';

class Service extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler() {
    var active = !this.state.active;

    this.setState({ active: active });
    // Notify the ServiceChooser, by calling its addTotal method
    this.props.addTotal(active ? this.props.price : -this.props.price);
  }
  render() {
    return (
      <p
        className={this.state.active ? 'active' : ''}
        onClick={this.clickHandler}
      >
        {this.props.name} <b>${this.props.price.toFixed(2)}</b>
      </p>
    );
  }
}

export default Service;
