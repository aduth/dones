/**
 * External dependencies
 */
import { stringify as stringifyQuery } from 'querystring';

/**
 * Internal dependencies
 */
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
import { getDone, isRequestingDones } from 'state/selectors';

export default {
	[ DONE_CREATE ]: async ( store, action ) => {
		const { date, text, done, transientId } = action;
		const { id } = await Request.post( '/dones/v1/dones', {
			body: { date, text, done }
		} );

		store.dispatch( updateDone( id, text, done, transientId ) );
	},
	[ DONE_DELETE ]: async ( store, { id } ) => {
		Request.delete( `/dones/v1/dones/${ id }` );
	},
	[ DONE_TOGGLE ]: async ( store, { id } ) => {
		const done = getDone( store.getState(), id );
		if ( done ) {
			store.dispatch( updateDone( id, done.text, ! done.done ) );
		}
	},
	[ DONE_UPDATE ]: async ( store, action ) => {
		const { id, text, done } = action;
		Request.put( `/dones/v1/dones/${ id }`, {
			body: { text, done }
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
			store.dispatch( receiveDones( dones, date ) );
			store.dispatch( { type: DONES_REQUEST_SUCCESS, date } );
		} catch ( error ) {
			store.dispatch( { type: DONES_REQUEST_FAILURE, date, error } );
		}
	}
};
