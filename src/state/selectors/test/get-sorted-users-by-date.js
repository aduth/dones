/**
 * External dependencies
 */
import { expect } from 'chai';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import { getSortedUsersByDate } from '../get-sorted-users-by-date';

describe( 'getSortedUsersByDate()', () => {
	it( 'should return array of users by current user, with dones, alphabetical', () => {
		const users = getSortedUsersByDate( {
			dones: {
				items: {
					325: {
						id: 325,
						user: 1,
						text: 'foo',
						date: '2017-05-11 00:00:00',
						done: true,
					},
					326: {
						id: 326,
						user: 3,
						text: 'bar',
						date: '2017-05-11 00:00:00',
						done: true,
					},
				},
				pages: {},
				received: {},
				totalPages: {},
			},
			users: {
				2: {
					id: 2,
					name: 'Daniel',
				},
				1: {
					id: 1,
					name: 'Andrew',
				},
				3: {
					id: 3,
					name: 'Charlie',
				},
				4: {
					id: 4,
					name: 'Ben',
				},
			},
		}, '2017-05-11' );

		expect( map( users, 'name' ) ).to.eql( [
			'Andrew',
			'Charlie',
			'Ben',
			'Daniel',
		] );
	} );
} );
