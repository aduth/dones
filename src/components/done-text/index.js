/**
 * External dependencies
 */
import { createElement } from 'preact';
import { reduce, truncate } from 'lodash';

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

export default function DoneText( { onClick, onFocus, onMouseDown, children } ) {
	const transforms = [ [
		/(^|\s)#(\S+)\b/,
		( [ , whitespace, tag ] ) => [
			whitespace,
			<Link preload to={ `/tags/${ tag }/` }>
				#{ tag }
			</Link>,
		],
	], [
		/(^|\s)(https?:\/\/\S+)/,
		( [ , whitespace, url ] ) => [
			whitespace,
			<span data-raw-text={ url }>
				<Link to={ url }>
					{ truncate( url.replace( /^https?:\/\/(www\.)?/, '' ) ) }
				</Link>
			</span>,
		],
	], [
		/`([^`]+)`/,
		( [ , code ] ) => <code>{ NULL_CHARACTER }{ code }{ NULL_CHARACTER }</code>,
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

	// Infer focus handlers as intent to edit. Ensure element can receive focus
	// and apply ARIA role to indicate editability.
	let focusProps;
	if ( onFocus ) {
		focusProps = {
			tabIndex: 0,
			role: 'textbox',
			onFocus,
		};
	}

	return (
		<div
			{ ...focusProps }
			onClick={ onClick }
			onMouseDown={ onMouseDown }
			className="done-text">
			{ parts }
		</div>
	);
}
