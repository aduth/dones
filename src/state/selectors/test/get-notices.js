/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getNotices } from '../get-notices';

describe( 'getNotices()', () => {
	it( 'returns an array of notices', () => {
		const notices = getNotices( {
			notices: {
				1: {
					status: 'error',
					text: 'foo'
				}
			}
		} );

		expect( notices ).to.eql( [
			{ id: '1', status: 'error', text: 'foo' }
		] );
	} );
} );
