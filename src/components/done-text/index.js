/**
 * External dependencies
 */
import { createElement, toChildArray, Component } from 'preact';
import { repeat, reduce, truncate } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';
import { getSelectedOffset } from 'lib/selection';

/**
 * Zero width character used as stand-in for replaced character to preserve
 * behavior of selection detection for editing done.
 *
 * @type {string}
 */
const ZERO_WIDTH_SPACE = '​';

/**
 * Tuples of transforms, first entry as a regular expression to match, second
 * entry as a function return element to use in place of the original text.
 *
 * @type {Array}
 */
const TRANSFORMS = [
	{
		pattern: /(^|[\s\.,;!\?])#([^\s\.,;!\?]+)/,
		transform: ( [ , whitespace, tag ] ) => [
			whitespace,
			<Link preload to={ `/tags/${ tag }/` }>
				#{ tag }
			</Link>,
		],
	},
	{
		pattern: /(^|\s)(https?:\/\/\S+)/,
		transform: ( [ , whitespace, url ] ) => {
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
	},
	{
		pattern: /`([^`]+)`/,
		transform: ( [ , code ] ) => (
			<code>{ ZERO_WIDTH_SPACE }{ code }{ ZERO_WIDTH_SPACE }</code>
		),
	},
];

/**
 * Given array of children, returns transformed children
 *
 * @param  {Array} children Original children
 * @return {Array}          Transformed children
 */
function getTransformedDoneText( children ) {
	let parts = [ ...toChildArray( children ) ];

	for ( const { pattern, transform } of TRANSFORMS ) {
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

	return parts;
}

export default class DoneText extends Component {
	setCopyText = ( event ) => {
		// Override the clipboard data with the original children text to avoid
		// zero-width spaces, and because its generally more useful if planned
		// to paste into a separate new done.

		let setData;
		if ( window.clipboardData ) {
			setData = ( text ) => window.clipboardData.setData( 'Text', text );
		} else if ( event.clipboardData ) {
			setData = ( text ) => event.clipboardData.setData( 'text/plain', text );
		}

		if ( ! setData ) {
			return;
		}

		const { children } = this.props;
		const [ start, end ] = getSelectedOffset( this.node );
		const text = children.join( '' ).slice( start, end );
		setData( text );
		event.preventDefault();
	};

	render() {
		const { onClick, onFocus, onMouseDown, children } = this.props;

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
			/* eslint-disable jsx-a11y/click-events-have-key-events */
			/* eslint-disable jsx-a11y/no-static-element-interactions */
			<div
				ref={ ( node ) => this.node = node }
				{ ...focusProps }
				onClick={ onClick }
				onMouseDown={ onMouseDown }
				onCopy={ this.setCopyText }
				className="done-text">
				<div className="done-text__overflow">
					{ getTransformedDoneText( children ) }
				</div>
			</div>
			/* eslint-enable jsx-a11y/no-static-element-interactions */
			/* eslint-enable jsx-a11y/click-events-have-key-events */
		);
	}
}
