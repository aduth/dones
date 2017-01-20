/**
 * Internal dependencies
 */
import { getDones } from './';

export default function getDone( state, id ) {
	return getDones( state )[ id ] || null;
}
