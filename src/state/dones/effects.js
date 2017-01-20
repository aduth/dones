/**
 * External dependencies
 */
import { stringify as stringifyQuery } from 'querystring';
import { pick } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import Request from 'lib/request';
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_TOGGLE,
	DONE_UPDATE,
	DONES_REQUEST,
	DONES_REQUEST_FAILURE,
	DONES_REQUEST_SUCCESS
} from 'state/action-types';
import { updateDone, receiveDones } from 'state/dones/actions';
import { getUserDone, isRequestingDones } from 'state/selectors';

export default {
	[ DONE_CREATE ]: async ( store, action ) => {
		Request.post( '/dones/v1/dones', {
			body: pick( action, 'date', 'text', 'done' )
		} );
	},
	[ DONE_DELETE ]: async ( store, action ) => {
		const url = `/dones/v1/dones?${ stringifyQuery( pick( action, 'index', 'date' ) ) }`;
		Request.delete( url );
	},
	[ DONE_TOGGLE ]: async ( store, action ) => {
		const { date, index } = action;
		const done = getUserDone( store.getState(), USER_ID, date, index );

		store.dispatch( updateDone( action.date, action.index, done.text, ! done.done ) );
	},
	[ DONE_UPDATE ]: async ( store, action ) => {
		Request.put( '/dones/v1/dones', {
			body: pick( action, 'index', 'date', 'text', 'done' )
		} );
	},
	[ DONES_REQUEST ]: async ( store, { date } ) => {
		const state = store.getState();
		if ( isRequestingDones( state, date ) ) {
			return;
		}

		try {
			const path = `/dones/v1/dones?${ stringifyQuery( { date } ) }`;
			const dones = await Request.get( path );
			store.dispatch( receiveDones( date, dones ) );
			store.dispatch( { type: DONES_REQUEST_SUCCESS, date } );
		} catch ( error ) {
			store.dispatch( { type: DONES_REQUEST_FAILURE, date, error } );
		}
	}
};
