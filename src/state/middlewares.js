/**
 * External dependencies
 */
import refx from 'refx';

/**
 * Internal dependencies
 */
import routing from './routing/middleware';
import effects from './effects';

export default [ refx( effects ), routing ];
