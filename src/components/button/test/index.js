/**
 * External dependencies
 */
import { createElement } from 'preact';

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

		const node = render( element );

		expect( node.nodeName ).toBe( 'BUTTON' );
		expect( node.classList.contains( 'button' ) ).toBe( true );
		expect( node.classList.contains( 'is-primary' ) ).toBe( true );
		expect( node.classList.contains( 'is-unstyled' ) ).toBe( true );
		expect( node.hasAttribute( 'primary' ) ).toBe( false );
		expect( node.hasAttribute( 'unstyled' ) ).toBe( false );
		expect( node.hasAttribute( 'to' ) ).toBe( false );
		expect( node.hasAttribute( 'disabled' ) ).toBe( true );
		expect( node.getAttribute( 'type' ) ).toBe( 'submit' );
		expect( node.getAttribute( 'aria-label' ) ).toBe( 'Additional' );
		expect( node.textContent ).toBe( 'Hello World' );
	} );

	it( 'renders a link with `to` prop', () => {
		const element = (
			<Button to="/">
				Hello World
			</Button>
		);

		const node = render( element );

		expect( node.nodeName ).toBe( 'A' );
		expect( node.hasAttribute( 'type' ) ).toBe( false );
		expect( node.getAttribute( 'href' ) ).toBe( SITE_URL + '/' );
		expect( node.textContent ).toBe( 'Hello World' );
	} );

	it( 'renders a button with `to` and `disabled` props', () => {
		const element = (
			<Button to="/" disabled>
				Hello World
			</Button>
		);

		const node = render( element );

		expect( node.nodeName ).toBe( 'BUTTON' );
		expect( node.hasAttribute( 'to' ) ).toBe( false );
		expect( node.getAttribute( 'type' ) ).toBe( 'button' );
	} );
} );
