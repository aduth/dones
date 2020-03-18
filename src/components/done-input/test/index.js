/**
 * External dependencies
 */
import { createElement } from 'preact';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import { DoneInput } from '../';

describe( 'DoneInput', () => {
	it( 'renders a done input with disabled submit', () => {
		const element = <DoneInput tags={ [] } />;

		const node = render( element );
		const textarea = node.querySelector( 'textarea:focus' );
		const submit = node.querySelector( '[type="submit"]' );

		expect( node.className ).toBe( 'done-input' );
		expect( textarea ).toBeTruthy();
		expect( submit.disabled ).toBe( true );
	} );

	it( 'renders a done input without autofocus on navigated', () => {
		const element = <DoneInput tags={ [] } hasNavigated />;

		const node = render( element );
		const textarea = node.querySelector( 'textarea:focus' );

		expect( textarea ).not.toBeTruthy();
	} );

	it( 'renders a done input with typeahead results', () => {
		const element = <DoneInput tags={ [ 'foo', 'bafo', 'aFo' ] } />;

		const node = render( element );
		const textarea = node.querySelector( 'textarea' );

		const setText = ( text ) => {
			const event = new Event( 'input' );
			Object.defineProperty( event, 'target', {
				get() {
					return Object.assign( textarea, {
						value: text,
						selectionStart: text.length,
						selectionEnd: text.length,
					} );
				},
			} );
			textarea.dispatchEvent( event );
		};

		const getSuggestions = () =>
			Array.from(
				document.querySelectorAll( '.popover-menu__button' )
			).map( ( button ) => button.textContent );

		setText( '#fo' );

		expect( getSuggestions() ).toEqual( [ 'foo', 'aFo', 'bafo' ] );

		setText( '#fo ' );

		expect( getSuggestions() ).toEqual( [] );
	} );
} );
