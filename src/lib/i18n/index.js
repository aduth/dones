/**
 * External dependencies
 */
import { once } from 'lodash';
import {
	addHours,
	parse as parseDate,
	format as formatDate,
} from 'date-fns';

/**
 * Internal dependencies
 */
import { I18N, GMT_OFFSET, DATE_FORMAT } from 'constant';

const getSiteFormat = once( () => {
	const PHP_DATE_FORMAT_TO_JS = {
		d: 'DD',
		D: 'ddd',
		j: 'D',
		l: 'dddd',
		N: 'E',
		S: 'o',
		w: 'e',
		z: 'DDD',
		W: 'W',
		F: 'MMMM',
		m: 'MM',
		M: 'MMM',
		n: 'M',
		o: 'YYYY',
		Y: 'YYYY',
		y: 'YY',
		a: 'a',
		A: 'A',
		g: 'h',
		G: 'H',
		h: 'hh',
		H: 'HH',
		i: 'mm',
		s: 'ss',
		u: 'SSS',
		U: 'X',
	};

	return DATE_FORMAT.replace( /\\?[a-zA-Z]/g, ( format ) => {
		return PHP_DATE_FORMAT_TO_JS[ format ] || '';
	} );
} );

export function translate( string ) {
	return I18N[ string ] || string;
}

export function toSiteTime( date ) {
	return addHours( addHours( date, date.getTimezoneOffset() / 60 ), GMT_OFFSET );
}

export function formatSiteDate( date ) {
	if ( ! ( date instanceof Date ) ) {
		date = parseDate( date );
	}

	return formatDate( date, getSiteFormat() );
}
