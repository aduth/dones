/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getDones from '../get-dones';

describe( 'getDones()', () => {
	it( 'should return null if query has not been received', () => {
		const dones = getDones( {
			dones: {
				items: {},
				pages: {},
				received: {},
				totalPages: {}
			}
		}, { tag: 'fill', page: 2 } );

		expect( dones ).to.be.null;
	} );

	it( 'should return array of dones for query by page', () => {
		const dones = getDones( {
			dones: {
				items: {
					290: {
						id: 290,
						user: 1,
						text: '#fill #the #tag #cloud',
						date: '2017-04-27 00:00:00',
						done: true
					}
				},
				pages: {
					'{"tag":"fill"}': [
						null,
						[
							290
						]
					]
				},
				received: {
					'{"page":2,"tag":"fill"}': true
				},
				totalPages: {
					'{"tag":"fill"}': 2
				}
			}
		}, { tag: 'fill', page: 2 } );

		expect( dones ).to.eql( [ {
			id: 290,
			user: 1,
			text: '#fill #the #tag #cloud',
			date: '2017-04-27 00:00:00',
			done: true
		} ] );
	} );
} );
