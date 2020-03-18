/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { getDones } from '../get-dones';

describe( 'getDones()', () => {
	it( 'returns dones for query (dash-delimited, unicode, terminators)', () => {
		const dones = getDones(
			{
				dones: {
					items: {
						290: {
							id: 290,
							user: 1,
							text: '#fill, #the,#dash-delimited-ö, #tag #cloud',
							date: '2017-04-27 00:00:00',
							done: true,
						},
					},
					pages: {
						'{"date":"2017-04-27","tag":"dash-delimited-ö"}': [
							null,
							[ 290 ],
						],
					},
					received: {
						'{"page":2,"date":"2017-04-27","tag":"dash-delimited-ö"}': true,
					},
					totalPages: {
						'{"date":"2017-04-27","tag":"dash-delimited-ö"}': 2,
					},
				},
			},
			{ tag: 'dash-delimited-ö', date: '2017-04-27', page: 2 }
		);

		expect( dones ).toEqual( [
			{
				id: 290,
				user: 1,
				text: '#fill, #the,#dash-delimited-ö, #tag #cloud',
				date: '2017-04-27 00:00:00',
				done: true,
			},
		] );
	} );

	it( 'returns dones for query (start, end)', () => {
		const dones = getDones(
			{
				dones: {
					items: {
						290: {
							id: 290,
							user: 1,
							text: '#fill',
							date: '2017-04-27 00:00:00',
							done: true,
						},
					},
					pages: {
						'{"tag":"fill"}': [ null, [ 290 ] ],
					},
					received: {
						'{"tag":"fill"}': true,
					},
					totalPages: {
						'{"tag":"fill"}': 1,
					},
				},
			},
			{ tag: 'fill' }
		);

		expect( dones ).toEqual( [
			{
				id: 290,
				user: 1,
				text: '#fill',
				date: '2017-04-27 00:00:00',
				done: true,
			},
		] );
	} );
} );
