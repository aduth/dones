/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { hasReceivedDones } from '../has-received-dones';

describe( 'hasReceivedDones()', () => {
	it( 'returns false if query not tracked', () => {
		const result = hasReceivedDones( {
			dones: {
				received: {},
			},
		}, { date: '2017-05-09' } );

		expect( result ).toBe( false );
	} );

	it( 'returns received value for query', () => {
		const result = hasReceivedDones( {
			dones: {
				received: {
					'{"date":"2017-05-09"}': true,
				},
			},
		}, { date: '2017-05-09' } );

		expect( result ).toBe( true );
	} );
} );
