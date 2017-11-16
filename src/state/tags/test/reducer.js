/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { TAGS_RECEIVE, DONE_CREATE } from 'state/action-types';
import reducer from '../reducer';

describe( 'reducer', () => {
	it( 'returns null by default', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.be.null;
	} );

	it( 'returns received tags', () => {
		const state = reducer( null, {
			type: TAGS_RECEIVE,
			tags: [ 'bar', 'baz' ],
		} );

		expect( state ).eql( [ 'bar', 'baz' ] );
	} );

	it( 'replaces received tags', () => {
		const originalState = deepFreeze( [ 'bar', 'baz' ] );
		const state = reducer( originalState, {
			type: TAGS_RECEIVE,
			tags: [ 'foo' ],
		} );

		expect( state ).eql( [ 'foo' ] );
	} );

	it( 'concatenates from created done', () => {
		const state = reducer( null, {
			type: DONE_CREATE,
			text: 'foo #bar #baz',
		} );

		expect( state ).eql( [ 'bar', 'baz' ] );
	} );

	it( 'merges unique from created done', () => {
		const originalState = deepFreeze( [ 'bar', 'baz' ] );
		const state = reducer( originalState, {
			type: DONE_CREATE,
			text: '#foo #bar',
		} );

		expect( state ).eql( [ 'bar', 'baz', 'foo' ] );
	} );
} );
