import React from 'react'
import ReactDOM from 'react-dom'

const axe = require('../../index')

describe('React-axe', function () {
	it('should assert that page content is correct', function () {
    cy.visit('http://localhost:8080');
    cy.get('h1').should('contain', 'Our services')
  });

  it('should run axe in the context of the document', function () {
    cy.visit('http://localhost:8080')
  	.then(function(win) {
      cy.spy(win.console, "group");
      cy.spy(win.console, "groupCollapsed");
      cy.spy(win.console, "groupEnd");

  		axe(React, ReactDOM, 0);

      cy.wait(1500)
      .then(function() {
        expect(win.console.group).to.be.calledWith('%cNew aXe issues', 'color:red;font-weight:normal;');
        expect(win.console.groupCollapsed).to.be.calledWith('%c%s: %c%s %s');
        expect(win.console.groupEnd).to.be.called;
      });
		});
  });
});