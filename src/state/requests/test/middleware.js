/**
 * External dependencies
 */
import { expect } from 'chai';
import { spy, stub, match } from 'sinon';
import proxyquire from 'proxyquire';
import { assign, noop, over } from 'lodash';

/**
 * Internal dependencies
 */
import {
	REQUEST,
	REQUEST_COMPLETE,
} from 'state/action-types';
import {
	addPreloadedResponse,
	setPathIsPreloading,
	setPathRequest,
} from 'state/requests/actions';

describe( 'middleware', () => {
	let mockedHandlers = {};

	const middleware = proxyquire( '../middleware', {
		'state/selectors': [
			'getPreloadedResponse',
			'getRequestNonce',
			'isCapturingRequestPreload',
			'isPreloadingPath',
			'getPathRequest',
		].reduce( ( memo, name ) => assign( memo, {
			[ name ]: ( ...args ) => ( mockedHandlers[ name ] || noop )( ...args ),
		} ), {} ),
	} ).default;

	const headers = [ [ 'x-ok', 1 ] ];
	const body = { ok: true };
	const response = {
		headers,
		json: () => Promise.resolve( body ),
	};
	const result = { headers: { 'x-ok': 1 }, body };
	before( () => {
		global.fetch = stub().returns( response );
		global.Headers = function() {};
		global.Headers.prototype = {};
	} );

	let dispatch, next, handler;
	beforeEach( () => {
		mockedHandlers = {};
		dispatch = spy();
		next = spy();

		handler = middleware( {
			getState: noop,
			dispatch,
		} )( next );
	} );

	after( () => {
		delete global.fetch;
		delete global.Headers;
	} );

	it( 'should do pass along unhandled if action is not of type request', () => {
		const action = { type: 'UNHANDLED' };

		handler( action );

		expect( next ).to.have.been.calledWith( action );
		expect( dispatch ).to.not.have.been.called;
	} );

	it( 'should append query string to request path', () => {
		const action = {
			type: REQUEST,
			path: '/foo',
			query: { bar: 'baz' },
		};

		handler( action );

		expect( action.path ).to.equal( '/foo?bar=baz' );
	} );

	it( 'should dispatch as preloading if capturing preload', () => {
		mockedHandlers.isCapturingRequestPreload = () => true;

		handler( {
			type: REQUEST,
			path: '/foo',
		} );

		expect( dispatch ).to.have.been.calledWith(
			setPathIsPreloading( '/foo', true )
		);
	} );

	it( 'should resolve result from preload', ( done ) => {
		mockedHandlers.getPreloadedResponse = ( state, path ) => path === '/foo' && result;

		handler( {
			type: REQUEST,
			path: '/foo',
			success: ( actualResult ) => {
				expect( actualResult ).to.eql( result );

				done();
			},
		} );
	} );

	it( 'should resolve from in-flight request', ( done ) => {
		const request = Promise.resolve( response );
		mockedHandlers.getPathRequest = ( state, path ) => path === '/foo' && request;

		handler( {
			type: REQUEST,
			path: '/foo',
			success: ( actualResult ) => {
				expect( dispatch ).to.have.been.calledWith(
					setPathIsPreloading( '/foo', false )
				);
				expect( actualResult ).to.eql( result );

				done();
			},
		} );
	} );

	it( 'should resolve from new fetch request', ( done ) => {
		handler( {
			type: REQUEST,
			path: '/foo',
			success: ( actualResult ) => {
				expect( dispatch ).to.have.been.calledWithMatch( {
					...setPathRequest( '/foo', {
						method: 'GET',
						headers: {},
					} ),
					request: match.object,
				} );
				expect( actualResult ).to.eql( result );

				done();
			},
		} );
	} );

	it( 'should add preloaded response data', ( done ) => {
		mockedHandlers.isPreloadingPath = ( state, path ) => path === '/foo';

		handler = middleware( {
			getState: noop,
			dispatch: over( dispatch, function( action ) {
				if ( REQUEST_COMPLETE === action.type ) {
					expect( dispatch ).to.have.been.calledWithMatch( {
						...addPreloadedResponse( '/foo', result ),
						id: match.truthy,
					} );

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
