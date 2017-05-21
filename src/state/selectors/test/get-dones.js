/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import getDones from '../get-dones';

describe( 'getDones()', () => {
	it( 'should return array of dones for query', () => {
		const dones = getDones( {
			dones: {
				items: {
					290: {
						id: 290,
						user: 1,
						text: '#fill, #the #tag #cloud',
						date: '2017-04-27 00:00:00',
						done: true
					}
				},
				pages: {
					'{"date":"2017-04-27","tag":"fill"}': [
						null,
						[
							290
						]
					]
				},
				received: {
					'{"page":2,"date":"2017-04-27","tag":"fill"}': true
				},
				totalPages: {
					'{"date":"2017-04-27","tag":"fill"}': 2
				}
			}
		}, { tag: 'fill', date: '2017-04-27', page: 2 } );

		expect( dones ).to.eql( [ {
			id: 290,
			user: 1,
			text: '#fill, #the #tag #cloud',
			date: '2017-04-27 00:00:00',
			done: true
		} ] );
	} );
} );
