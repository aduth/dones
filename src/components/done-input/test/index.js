/**
 * External dependencies
 */
import { createElement } from 'preact';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { render } from 'test/utils';
import { DoneInput } from '../';

describe( 'DoneInput', () => {
	it( 'renders a done input with disabled submit', () => {
		const element = <DoneInput tags={ [] } />;

		const node = render( element, document.body );
		const submit = node.querySelector( '[type="submit"]' );

		expect( node.className ).to.equal( 'done-input' );
		expect( submit.disabled ).to.be.true;
	} );

	it( 'renders a done input with typeahead results', () => {
		const element = <DoneInput tags={ [ 'foo' ] } />;

		const node = render( element, document.body );
		const component = node._component._component;

		component.setText( {
			target: {
				value: '#fo',
				selectionStart: 3,
				selectionEnd: 3,
			},
		} );

		expect( component.state.tagFragment ).to.equal( 'fo' );
		expect( component.getSuggestions() ).to.eql( [ 'foo' ] );

		component.setText( {
			target: {
				value: '#fo ',
				selectionStart: 4,
				selectionEnd: 4,
			},
		} );

		expect( component.state.tagFragment ).to.be.null;
		expect( component.getSuggestions() ).to.eql( [] );
	} );
} );
