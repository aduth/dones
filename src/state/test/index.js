/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import configureReduxStore from '../';

describe( 'configureReduxStore()', () => {
	it( 'returns same reference on unhandled action', () => {
		const store = configureReduxStore();
		const state = store.getState();

		store.dispatch( { type: '__UNHANDLED_ACTION__' } );

		expect( store.getState() ).toBe( state );
	} );
} );
