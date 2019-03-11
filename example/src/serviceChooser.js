import React from 'react';
import ShadowDOM from 'react-shadow';
import createReactClass from 'create-react-class';

import styles from './services.css';
import Service from './service';

module.exports = createReactClass({
  getInitialState: function() {
    return { total: 0 };
  },
  addTotal: function(price) {
    this.setState({ total: this.state.total + price });
  },
  render: function() {
    var self = this;
    var services = this.props.items.map(function(s) {
      // Create a new Service component for each item in the items array.
      // Notice that I pass the self.addTotal function to the component.
      return (
        <Service
          key={s.name}
          name={s.name}
          price={s.price}
          active={s.active}
          addTotal={self.addTotal}
        />
      );
    });
    return (
      <ShadowDOM>
        <service-chooser>
          <div id="services">
            {services}
            <p id="total">
              Total <b>${this.state.total.toFixed(2)}</b>
            </p>
          </div>
          <style type="text/css">{styles}</style>
        </service-chooser>
      </ShadowDOM>
    );
  }
});
