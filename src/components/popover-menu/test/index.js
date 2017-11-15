/**
 * External dependencies
 */
import { createElement } from 'preact';
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import PopoverMenu from '../';

describe( 'PopoverMenu', () => {
	let sandbox;
	before( () => {
		sandbox = sinon.sandbox.create();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( 'renders nothing if there are no items', () => {
		const onSelect = sinon.spy();
		const element = (
			<PopoverMenu
				items={ [] }
				onSelect={ onSelect } />
		);

		const node = render( element, document.body );

		expect( node.nodeType ).to.equal( Node.TEXT_NODE );
		expect( node.nodeValue ).to.equal( '' );

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).not.to.have.been.called;
	} );

	it( 'renders a list of items', () => {
		const element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element, document.body );
		const list = node.querySelector( '.popover-menu__list' );

		expect( list ).to.be.ok;
		expect( list.childElementCount ).to.equal( 2 );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).to.be.true;
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.false;
	} );

	it( 'navigates list items by keypress', () => {
		const element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element, document.body );
		const list = node.querySelector( '.popover-menu__list' );

		let event;

		// Down twice: test maximum selected
		event = new KeyboardEvent( 'keydown', {
			keyCode: 40,
		} );

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).to.be.false;
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.true;

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).to.be.false;
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.true;

		// Up twice: test minimum selected
		event = new KeyboardEvent( 'keydown', {
			keyCode: 38,
		} );

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).to.be.true;
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.false;

		window.dispatchEvent( event );
		expect( list.childNodes[ 0 ].classList.contains( 'is-selected' ) ).to.be.true;
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.false;
	} );

	it( 'selects item on enter by default', () => {
		const onSelect = sinon.spy();
		const element = (
			<PopoverMenu
				onSelect={ onSelect }
				items={ [ 'Foo', 'Bar' ] } />
		);

		render( element, document.body );

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).to.have.been.calledWith( 'Foo' );
	} );

	it( 'selects item on enter by custom keycode', () => {
		const onSelect = sinon.spy();
		const element = (
			<PopoverMenu
				onSelect={ onSelect }
				items={ [ 'Foo', 'Bar' ] }
				selectKeyCode={ 32 } />
		);

		render( element, document.body );

		let event;

		// Test default not calling
		event = new KeyboardEvent( 'keydown', {
			keyCode: 13,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).not.to.have.been.called;

		// Test custom keycode
		event = new KeyboardEvent( 'keydown', {
			keyCode: 32,
		} );
		window.dispatchEvent( event );

		expect( onSelect ).to.have.been.called;
	} );

	it( 'limits selected index when options shrink', () => {
		let element = <PopoverMenu items={ [ 'Foo', 'Bar', 'Baz' ] } />;

		render( element, document.body );

		const event = new KeyboardEvent( 'keydown', {
			keyCode: 40,
		} );
		window.dispatchEvent( event );
		window.dispatchEvent( event );

		element = <PopoverMenu items={ [ 'Foo', 'Bar' ] } />;

		const node = render( element, document.body );
		const list = node.querySelector( '.popover-menu__list' );

		window.dispatchEvent( event );
		expect( list.childNodes[ 1 ].classList.contains( 'is-selected' ) ).to.be.true;
	} );
} );
