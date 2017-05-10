/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import reducer from '../reducer';

describe( 'reducer', () => {
	it( 'should export expected keys', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [
			'items',
			'pages',
			'totalPages'
		] );
	} );
} );
