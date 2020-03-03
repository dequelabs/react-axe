import React from 'react';
import ShadowDOM from 'react-shadow';

import styles from './services.css';
import Service from './service';

class ServiceChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0
    };
    this.addTotal = this.addTotal.bind(this);
  }
  addTotal(price) {
    this.setState({ total: this.state.total + price });
  }
  render() {
    var services = this.props.items.map(s => {
      // Create a new Service component for each item in the items array.
      // Notice that I pass the addTotal function to the component.
      return (
        <Service
          key={s.name}
          name={s.name}
          price={s.price}
          active={s.active}
          addTotal={this.addTotal}
        />
      );
    });

    return (
      <ShadowDOM.div id="service-chooser">
        <div id="services">
          {services}
          <p id="total">
            Total <b>${this.state.total.toFixed(2)}</b>
          </p>
        </div>
        <style type="text/css">{styles}</style>
      </ShadowDOM.div>
    );
  }
}

export default ServiceChooser;
