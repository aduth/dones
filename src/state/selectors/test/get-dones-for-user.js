/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getDonesForUser from '../get-dones-for-user';

describe( 'getDonesForUser()', () => {
	it( 'should return array of dones for query by page, user ID', () => {
		const dones = getDonesForUser( {
			dones: {
				items: {
					325: {
						id: 325,
						user: 1,
						text: '#in_valid',
						date: '2017-05-11 00:00:00',
						done: true
					},
					326: {
						id: 326,
						user: 2,
						text: '#in_valid',
						date: '2017-05-11 00:00:00',
						done: true
					}
				},
				pages: {
					'{"date":"2017-05-11"}': [ [ 325, 326 ] ]
				},
				received: {
					'{"date":"2017-05-11"}': true
				},
				totalPages: {
					'{"date":"2017-05-11"}': 1
				}
			}
		}, { date: '2017-05-11' }, 1 );

		expect( dones ).to.eql( [ {
			id: 325,
			user: 1,
			text: '#in_valid',
			date: '2017-05-11 00:00:00',
			done: true
		} ] );
	} );
} );
