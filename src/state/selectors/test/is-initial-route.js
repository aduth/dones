/**
 * External dependencies
 */
import { expect } from 'chai';

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

		expect( isInitial ).to.be.true;
	} );

	it( 'should return false if not initial route', () => {
		const isInitial = isInitialRoute( {
			routing: {
				isInitial: false,
			},
		} );

		expect( isInitial ).to.be.false;
	} );
} );
