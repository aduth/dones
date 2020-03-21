/**
 * External dependencies
 */
import { createElement } from 'preact';
import { act } from 'preact/test-utils';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import createReduxStore from 'state';
import DoneInput from '../';
import { receiveTags } from 'state/tags/actions';
import { pushRoute } from 'state/routing/actions';

describe( 'DoneInput', () => {
	let store;
	beforeEach( () => {
		store = createReduxStore();
	} );

	it( 'renders a done input with disabled submit', () => {
		const element = <DoneInput />;

		const node = render( element );
		const textarea = node.querySelector( 'textarea:focus' );
		const submit = node.querySelector( '[type="submit"]' );

		expect( node.className ).toBe( 'done-input' );
		expect( textarea ).toBeTruthy();
		expect( submit.disabled ).toBe( true );
	} );

	it( 'renders a done input without autofocus on navigated', () => {
		// Ensure `hasNavigated` is true.
		store.dispatch( pushRoute( '/404/' ) );
		const element = <DoneInput />;

		const node = render( element, store );
		const textarea = node.querySelector( 'textarea:focus' );

		expect( textarea ).not.toBeTruthy();
	} );

	it( 'renders a done input with typeahead results', () => {
		store.dispatch( receiveTags( [ 'foo', 'bafo', 'aFo' ] ) );
		const element = <DoneInput />;

		const node = render( element, store );
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

		act( () => {
			setText( '#fo' );
		} );

		expect( getSuggestions() ).toEqual( [ 'foo', 'aFo', 'bafo' ] );

		act( () => {
			setText( '#fo ' );
		} );

		expect( getSuggestions() ).toEqual( [] );
	} );
} );
