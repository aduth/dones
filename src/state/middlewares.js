/**
 * External dependencies
 */
import refx from 'refx';
import multi from 'redux-multi';

/**
 * Internal dependencies
 */
import routing from './routing/middleware';
import requests from './requests/middleware';
import effects from './effects';

export default [ multi, refx( effects ), routing, requests ];
