import React from 'react';
import ReactDOM from 'react-dom';

const axe = require('../../index');

function filterLogs(args, type) {
  let filtered = [];
  args.forEach(function(arg, index) {
    if (arg.length === 2 && arg[1] === type) {
      filtered = arg[1];
    } else if (arg.length === 6 && arg[4] === type) {
      filtered = arg[4];
    }
  });
  return filtered;
}

describe('React-axe', function() {
  it('should assert that page content is correct', function() {
    cy.visit('http://localhost:8080');
    cy.get('h1').should('contain', 'Our services');
  });

  it('should run axe in the context of the document', function() {
    cy.visit('http://localhost:8080').then(function(win) {
      cy.spy(win.console, 'group');
      cy.spy(win.console, 'groupCollapsed');
      cy.spy(win.console, 'groupEnd');

      axe(React, ReactDOM, 0).then(function() {
        expect(win.console.group).to.be.calledWith(
          '%cNew aXe issues',
          'color:red;font-weight:normal;'
        );
        expect(win.console.groupCollapsed).to.be.calledWith('%c%s: %c%s %s');
        expect(win.console.groupEnd).to.be.called;
      });
    });
  });

  it('should run axe inside of Shadow DOM', function() {
    cy.visit('http://localhost:8080').then(function(win) {
      const groupCollapsed = cy.spy(win.console, 'groupCollapsed');
      const colorMessage = 'Elements must have sufficient color contrast';

      let serviceChooser;
      cy.get('service-chooser')
        .first()
        .then(function(node) {
          serviceChooser = node[0];
        });

      axe(React, ReactDOM, 0).then(function() {
        expect(filterLogs(groupCollapsed.args, colorMessage)).to.equal(
          colorMessage
        );
        expect(filterLogs(groupCollapsed.args, serviceChooser)).to.equal(
          serviceChooser
        );
      });
    });
  });
});
