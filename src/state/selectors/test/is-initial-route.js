/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import isInitialRoute from '../is-initial-route';

describe( 'isInitialRoute()', () => {
	it( 'should return true if initial route', () => {
		const isInitial = isInitialRoute( {
			routing: {
				isInitial: true,
			},
		} );

		expect( isInitial ).toBe( true );
	} );

	it( 'should return false if not initial route', () => {
		const isInitial = isInitialRoute( {
			routing: {
				isInitial: false,
			},
		} );

		expect( isInitial ).toBe( false );
	} );
} );
