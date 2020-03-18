/**
 * External dependencies
 */
import { createElement } from 'preact';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import PopoverMenu from '../';

describe( 'PopoverMenu', () => {
	it( 'renders nothing if there are no items', () => {
		const onSelect = jest.fn();
		const element = <PopoverMenu items={ [] } onSelect={ onSelect } />;

		const node = render( element );

		expect( node ).not.toBeTruthy();

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).not.toHaveBeenCalled();
	} );

	it( 'renders a list of items', () => {
		const element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element );
		const list = node.querySelector( '.popover-menu__list' );

		expect( list ).toBeTruthy();
		expect( list.childElementCount ).toBe( 2 );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			false
		);
	} );

	it( 'navigates list items by keypress', () => {
		const element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element );
		const list = node.querySelector( '.popover-menu__list' );

		let event;

		// Down twice: test maximum selected
		event = new KeyboardEvent( 'keydown', {
			keyCode: 40,
		} );

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).toBe(
			false
		);
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).toBe(
			false
		);
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);

		// Up twice: test minimum selected
		event = new KeyboardEvent( 'keydown', {
			keyCode: 38,
		} );

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			false
		);

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			false
		);
	} );

	it( 'selects item on enter by default', () => {
		const onSelect = jest.fn();
		const element = (
			<PopoverMenu onSelect={ onSelect } items={ [ 'Foo', 'Bar' ] } />
		);

		render( element );

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).toHaveBeenCalledWith( 'Foo' );
	} );

	it( 'selects item on enter by custom keycode', () => {
		const onSelect = jest.fn();
		const element = (
			<PopoverMenu
				onSelect={ onSelect }
				items={ [ 'Foo', 'Bar' ] }
				selectKeyCode={ 32 }
			/>
		);

		render( element );

		let event;

		// Test default not calling
		event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).not.toHaveBeenCalled();

		// Test custom keycode
		event = new KeyboardEvent( 'keydown', {
			keyCode: 32,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).toHaveBeenCalled();
	} );

	it( 'limits selected index when options shrink', () => {
		let element = <PopoverMenu items={ [ 'Foo', 'Bar', 'Baz' ] } />;

		render( element );

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 40,
		} );
		window.dispatchEvent( event );
		window.dispatchEvent( event );

		element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element );
		const list = node.querySelector( '.popover-menu__list' );

		window.dispatchEvent( event );
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).toBe(
			true
		);
	} );
} );
