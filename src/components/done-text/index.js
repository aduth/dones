/**
 * External dependencies
 */
import { createElement } from 'preact';
import { repeat, reduce, truncate } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

/**
 * Zero width character used as stand-in for replaced character to preserve
 * behavior of selection detection for editing done.
 *
 * @type {String}
 */
const ZERO_WIDTH_SPACE = '​';

export default function DoneText( { onClick, onFocus, onMouseDown, children } ) {
	const transforms = [ [
		/(^|\s)#(\S+)/,
		( [ , whitespace, tag ] ) => [
			whitespace,
			<Link preload to={ `/tags/${ tag }/` }>
				#{ tag }
			</Link>,
		],
	], [
		/(^|\s)(https?:\/\/\S+)/,
		( [ , whitespace, url ] ) => {
			const [ prefix ] = url.match( /^https?:\/\/(www\.)?/ );
			const endRepeat = Math.max( 0, url.length - prefix.length - 30 );

			return [
				whitespace,
				<Link to={ url }>
					{ repeat( ZERO_WIDTH_SPACE, prefix.length ) }
					{ truncate( url.substr( prefix.length ), {
						omission: '…',
						length: 30,
					} ) }
					{ repeat( ZERO_WIDTH_SPACE, endRepeat ) }
				</Link>,
			];
		},
	], [
		/`([^`]+)`/,
		( [ , code ] ) => (
			<code>{ ZERO_WIDTH_SPACE }{ code }{ ZERO_WIDTH_SPACE }</code>
		),
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
			<div className="done-text__overflow">
				{ parts }
			</div>
		</div>
	);
}
