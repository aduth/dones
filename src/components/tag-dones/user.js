/**
 * External dependencies
 */
import { createElement } from 'preact';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import DoneText from 'components/done-text';
import User from 'components/user';

export default function TagDonesUser( { userId, dones } ) {
	return (
		<div>
			<h3 className="tag-dones__user-label">
				<User userId={ userId } />
			</h3>
			<ul className="tag-dones__user-list">
				{ map( dones, ( done ) => (
					<li
						key={ done.id }
						className="tag-dones__user-list-item">
						<DoneText>{ done.text }</DoneText>
					</li>
				) ) }
			</ul>
		</div>
	);
}
