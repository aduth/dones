/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import documentHead from './document-head/reducer';
import dones from './dones/reducer';
import routing from './routing/reducer';
import tags from './tags/reducer';
import users from './users/reducer';

export default combineReducers( {
	documentHead,
	dones,
	routing,
	tags,
	users
} );
