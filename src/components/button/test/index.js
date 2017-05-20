/**
 * External dependencies
 */
import { createElement } from 'preact';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import { SITE_URL } from 'constant';
import Button from '../';

describe( 'Button', () => {
	it( 'renders a button', () => {
		const element = (
			<Button
				primary
				unstyled
				disabled
				type="submit"
				aria-label="Additional">
				Hello World
			</Button>
		);

		const node = render( element, document.body );

		expect( node.nodeName ).to.equal( 'BUTTON' );
		expect( node.classList.contains( 'button' ) ).to.be.true;
		expect( node.classList.contains( 'is-primary' ) ).to.be.true;
		expect( node.classList.contains( 'is-unstyled' ) ).to.be.true;
		expect( node.hasAttribute( 'primary' ) ).to.be.false;
		expect( node.hasAttribute( 'unstyled' ) ).to.be.false;
		expect( node.hasAttribute( 'to' ) ).to.be.false;
		expect( node.hasAttribute( 'disabled' ) ).to.be.true;
		expect( node.getAttribute( 'type' ) ).to.equal( 'submit' );
		expect( node.getAttribute( 'aria-label' ) ).to.equal( 'Additional' );
		expect( node.textContent ).to.equal( 'Hello World' );
	} );

	it( 'renders a link with `to` prop', () => {
		const element = (
			<Button to="/">
				Hello World
			</Button>
		);

		const node = render( element, document.body );

		expect( node.nodeName ).to.equal( 'A' );
		expect( node.hasAttribute( 'type' ) ).to.be.false;
		expect( node.getAttribute( 'href' ) ).to.equal( SITE_URL + '/' );
		expect( node.textContent ).to.equal( 'Hello World' );
	} );

	it( 'renders a button with `to` and `disabled` props', () => {
		const element = (
			<Button to="/" disabled>
				Hello World
			</Button>
		);

		const node = render( element, document.body );

		expect( node.nodeName ).to.equal( 'BUTTON' );
		expect( node.hasAttribute( 'to' ) ).to.be.false;
		expect( node.getAttribute( 'type' ) ).to.equal( 'button' );
	} );
} );
