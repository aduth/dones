/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import hasReceivedTags from '../has-received-tags';

describe( 'hasReceivedTags()', () => {
	it( 'returns false if tags have not been received', () => {
		const hasReceived = hasReceivedTags( {
			tags: null,
		} );

		expect( hasReceived ).toBe( false );
	} );

	it( 'returns true if tags have been received', () => {
		const hasReceived = hasReceivedTags( {
			tags: [],
		} );

		expect( hasReceived ).toBe( true );
	} );
} );
