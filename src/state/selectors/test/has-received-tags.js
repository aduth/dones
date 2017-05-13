/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import hasReceivedTags from '../has-received-tags';

describe( 'hasReceivedTags()', () => {
	it( 'returns false if tags have not been received', () => {
		const hasReceived = hasReceivedTags( {
			tags: null
		} );

		expect( hasReceived ).to.be.false;
	} );

	it( 'returns true if tags have been received', () => {
		const hasReceived = hasReceivedTags( {
			tags: []
		} );

		expect( hasReceived ).to.be.true;
	} );
} );
