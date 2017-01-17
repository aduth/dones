/**
 * External dependencies
 */
import { h } from 'preact';
import { reduce } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

/**
 * Null character used as stand-in for replaced character to preserve behavior
 * of selection detection for editing done.
 *
 * @type {String}
 */
const NULL_CHARACTER = String.fromCharCode( 0 );

export default function DonesListItemText( { onClick, onMouseDown, children } ) {
	const transforms = [ [
		/(^|\s)#(\S+)\b/,
		( [ , whitespace, tag ] ) => [
			whitespace,
			<Link to={ `/tag/${ tag }` }>
				#{ tag }
			</Link>
		]
	], [
		/(^|\s)(https?:\/\/\S+)/,
		( [ , whitespace, url ] ) => [
			whitespace,
			<Link to={ url }>
				{ url }
			</Link>
		]
	], [
		/`([^`]+)`/,
		( [ , code ] ) => <code>{ NULL_CHARACTER }{ code }{ NULL_CHARACTER }</code>
	] ];

	let parts = [ ...children ];

	for ( const [ pattern, transform ] of transforms ) {
		parts = reduce( parts, ( memo, part ) => {
			if ( 'string' !== typeof part ) {
				return memo.concat( part );
			}

			let match;
			while ( ( match = part.match( pattern ) ) ) {
				memo.push( part.substr( 0, match.index ) );
				memo = memo.concat( transform( match ) );
				part = part.substr( match.index + match[ 0 ].length );
			}

			memo.push( part );

			return memo;
		}, [] );
	}

	return (
		<div
			onClick={ onClick }
			onMouseDown={ onMouseDown }
			className="dones-list__item-text">
			{ parts }
		</div>
	);
}
