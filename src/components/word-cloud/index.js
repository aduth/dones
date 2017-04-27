/**
 * External dependencies
 */
import { createElement } from 'preact';
import { mean, chunk, map } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

export default function( { items } ) {
	const average = mean( map( items, 'count' ) );

	return (
		<ul className="word-cloud">
			{ map( chunk( items, 4 ), ( chunked ) => {
				return (
					<li className="word-cloud__column">
						{ map( chunked, ( item ) => {
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

							return (
								<li key={ text } className="word-cloud__item">
									<Tag { ...props } />
								</li>
							);
						} ) }
					</li>
				);
			} ) }
		</ul>
	);
}
