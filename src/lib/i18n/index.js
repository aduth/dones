/**
 * External dependencies
 */
import { date as phpdate } from 'phpdate';

/**
 * Internal dependencies
 */
import { I18N, GMT_OFFSET, DATE_FORMAT } from 'constant';

/**
 * Constant GMT offset, in milliseconds.
 *
 * @type {number}
 */
const GMT_OFFSET_MS = GMT_OFFSET * 60 * 60 * 1000;

export function translate( string ) {
	return I18N[ string ] || string;
}

export function toSiteTime( date = new Date() ) {
	const dateOffsetMs = date.getTimezoneOffset() * 60 * 1000;
	date.setTime( date.getTime() + dateOffsetMs + GMT_OFFSET_MS );
	return date;
}

export function formatSiteDate( date ) {
	if ( ! ( date instanceof Date ) ) {
		date = toSiteTime( new Date( date ) );
	}

	return phpdate( DATE_FORMAT, date );
}
