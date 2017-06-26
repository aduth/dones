/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { NOTICE_DISPLAY, NOTICE_HIDE } from 'state/action-types';
import reducer from '../reducer';

describe( 'reducer', () => {
	it( 'returns an empty object by default', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.eql( {} );
	} );

	it( 'keys action by id', () => {
		const state = reducer( undefined, {
			type: NOTICE_DISPLAY,
			id: '1',
			status: 'error',
			text: 'foo'
		} );

		expect( state ).to.eql( {
			1: {
				status: 'error',
				text: 'foo'
			}
		} );
	} );

	it( 'returns same reference on removing untracked id', () => {
		const original = deepFreeze( {
			1: {
				status: 'error',
				text: 'foo'
			}
		} );
		const state = reducer( original, {
			type: NOTICE_HIDE,
			id: '2'
		} );

		expect( state ).to.equal( original );
	} );

	it( 'returns object with removed notice id', () => {
		const original = deepFreeze( {
			1: {
				status: 'error',
				text: 'foo'
			}
		} );
		const state = reducer( original, {
			type: NOTICE_HIDE,
			id: '1'
		} );

		expect( state ).to.eql( {} );
	} );
} );
