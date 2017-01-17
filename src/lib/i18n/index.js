/**
 * External dependencies
 */
import moment from 'moment';
import { once } from 'lodash';

/**
 * Internal dependencies
 */
import { I18N, GMT_OFFSET, DATE_FORMAT } from 'constant';

const getSiteMomentFormat = once( () => {
	const PHP_DATE_FORMAT_TO_MOMENT = {
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
		U: 'X'
	};

	return DATE_FORMAT.replace( /\\?[a-zA-Z]/g, ( format ) => {
		return PHP_DATE_FORMAT_TO_MOMENT[ format ] || '';
	} );
} );

export function translate( string ) {
	return I18N[ string ] || string;
}

export function formatDate( date, format ) {
	return moment( date ).utcOffset( GMT_OFFSET * 60 ).format( format );
}

export function formatSiteDate( date ) {
	return formatDate( date, getSiteMomentFormat() );
}
