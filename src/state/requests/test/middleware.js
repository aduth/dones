/**
 * External dependencies
 */
import { noop, over } from 'lodash';

/**
 * Internal dependencies
 */
import { REQUEST, REQUEST_COMPLETE } from 'state/action-types';
import * as selectors from 'state/selectors';
import {
	addPreloadedResponse,
	setPathIsPreloading,
	setPathRequest,
} from 'state/requests/actions';
import middleware from '../middleware';

jest.mock( 'state/selectors', () => ( {
	getPreloadedResponse: jest.fn(),
	getRequestNonce: jest.fn(),
	isCapturingRequestPreload: jest.fn(),
	isPreloadingPath: jest.fn(),
	getPathRequest: jest.fn(),
} ) );

describe( 'middleware', () => {
	const headers = [ [ 'x-ok', 1 ] ];
	const body = { ok: true };
	const response = {
		headers,
		ok: true,
		statusText: 'OK',
		json: () => Promise.resolve( body ),
	};
	const result = { headers: { 'x-ok': 1 }, body };
	beforeAll( () => {
		global.fetch = jest.fn().mockReturnValue( response );
		global.Headers = function() {};
		global.Headers.prototype = {};
	} );

	let dispatch, next, handler;
	beforeEach( () => {
		selectors.getPreloadedResponse.mockRestore();
		selectors.getRequestNonce.mockRestore();
		selectors.isCapturingRequestPreload.mockRestore();
		selectors.isPreloadingPath.mockRestore();
		selectors.getPathRequest.mockRestore();

		dispatch = jest.fn();
		next = jest.fn();

		handler = middleware( {
			getState: noop,
			dispatch,
		} )( next );
	} );

	afterAll( () => {
		delete global.fetch;
		delete global.Headers;
	} );

	it( 'should do pass along unhandled if action is not of type request', () => {
		const action = { type: 'UNHANDLED' };

		handler( action );

		expect( next ).toHaveBeenCalledWith( action );
		expect( dispatch ).not.toHaveBeenCalled();
	} );

	it( 'should append query string to request path', () => {
		const action = {
			type: REQUEST,
			path: '/foo',
			query: { bar: 'baz' },
		};

		handler( action );

		expect( action.path ).toBe( '/foo?bar=baz' );
	} );

	it( 'should dispatch as preloading if capturing preload', () => {
		selectors.isCapturingRequestPreload.mockImplementation( () => true );

		handler( {
			type: REQUEST,
			path: '/foo',
		} );

		expect( dispatch ).toHaveBeenCalledWith(
			setPathIsPreloading( '/foo', true )
		);
	} );

	it( 'should resolve result from preload', ( done ) => {
		selectors.getPreloadedResponse.mockImplementation(
			( state, path ) => path === '/foo' && result
		);

		handler( {
			type: REQUEST,
			path: '/foo',
			success: ( actualResult ) => {
				expect( actualResult ).toEqual( result );

				done();
			},
		} );
	} );

	it( 'should resolve from in-flight request', ( done ) => {
		const request = Promise.resolve( response );
		selectors.getPathRequest.mockImplementation(
			( state, path ) => path === '/foo' && request
		);

		handler( {
			type: REQUEST,
			path: '/foo',
			success: ( actualResult ) => {
				expect( dispatch ).toHaveBeenCalledWith(
					setPathIsPreloading( '/foo', false )
				);
				expect( actualResult ).toEqual( result );

				done();
			},
		} );
	} );

	it( 'should resolve from new fetch request', ( done ) => {
		handler( {
			type: REQUEST,
			path: '/foo',
			success( actualResult ) {
				expect( dispatch ).toHaveBeenCalledWith(
					expect.objectContaining( {
						...setPathRequest( '/foo', {
							method: 'GET',
							headers: {},
						} ),
						request: expect.any( Object ),
					} )
				);
				expect( actualResult ).toEqual( result );

				done();
			},
		} );
	} );

	it( 'should reject from non-ok request', ( done ) => {
		const originalResponse = { ...response };
		response.ok = false;
		response.statusText = 'Forbidden';

		handler( {
			type: REQUEST,
			path: '/foo',
			success() {
				done( new Error( 'Unexpected success call' ) );
			},
			failure( error ) {
				expect( error.message ).toBe( 'Forbidden' );

				Object.assign( response, originalResponse );

				done();
			},
		} );
	} );

	it( 'should add preloaded response data', ( done ) => {
		selectors.isPreloadingPath.mockImplementation(
			( state, path ) => path === '/foo'
		);

		handler = middleware( {
			getState: noop,
			dispatch: over( dispatch, function( action ) {
				if ( REQUEST_COMPLETE === action.type ) {
					expect( dispatch ).toHaveBeenCalledWith(
						expect.objectContaining( {
							...addPreloadedResponse( '/foo', result ),
							id: expect.anything(),
						} )
					);

					done();
				}
			} ),
		} )( next );

		handler( {
			type: REQUEST,
			path: '/foo',
			success: () => {
				done( new Error( 'Unexpected success call' ) );
			},
		} );
	} );
} );
