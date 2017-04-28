/**
 * External dependencies
 */
import { createElement } from 'preact';
import { mean, reduce, map, last } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

export default function( { items } ) {
	const average = mean( map( items, 'count' ) );
	let length;

	return (
		<ul className="word-cloud">
			{ map( reduce( items, ( memo, item ) => {
				const { text, count, url } = item;
				const Tag = url ? Link : 'span';

				// Weight count against average, within reason
				let scale = 100 + ( ( count - average ) * 20 );
				scale = Math.max( 50, scale );
				scale = Math.min( 250, scale );

				const props = {
					children: text,
					style: {
						fontSize: scale + '%',
					}
				};

				if ( url ) {
					props.to = url;
				}

				if ( ! length || length > 30 ) {
					memo.push( [] );
					length = 0;
				}

				last( memo ).push(
					<li key={ text } className="word-cloud__item">
						<Tag { ...props } />
					</li>
				);

				length += text.length;

				return memo;
			}, [] ), ( column, i ) => (
				<li key={ i } className="word-cloud__column">
					{ column }
				</li>
			) ) }
		</ul>
	);
}
