/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import documentHead from './document-head/reducer';
import dones from './dones/reducer';
import notices from './notices/reducer';
import requests from './requests/reducer';
import routing from './routing/reducer';
import tags from './tags/reducer';
import users from './users/reducer';

export default combineReducers( {
	documentHead,
	dones,
	notices,
	requests,
	routing,
	tags,
	users,
} );
