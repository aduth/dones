/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import isMutativeRequestInFlight from '../is-mutative-request-in-flight';

describe( 'isMutativeRequestInFlight()', () => {
	it( 'should return false if no requests in flight', () => {
		const isRequestInFlight = isMutativeRequestInFlight( {
			requests: {
				items: {},
			},
		} );

		expect( isRequestInFlight ).to.equal( false );
	} );

	it( 'should return false if GET request in flight', () => {
		const isRequestInFlight = isMutativeRequestInFlight( {
			requests: {
				items: {
					'/foo': {
						GET: {},
					},
				},
			},
		} );

		expect( isRequestInFlight ).to.equal( false );
	} );

	it( 'should return true if POST request in flight', () => {
		const isRequestInFlight = isMutativeRequestInFlight( {
			requests: {
				items: {
					'/foo': {
						POST: {},
					},
				},
			},
		} );

		expect( isRequestInFlight ).to.equal( true );
	} );
} );
