/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import Card from 'components/card';
import DoneInput from 'components/done-input';
import DonesList from 'components/dones-list';
import { getUser } from 'state/selectors';

function UserDones( { userId, date, avatar, name } ) {
	let title = name;
	if ( avatar ) {
		title = (
			<span>
				<img
					src={ avatar }
					alt={ name }
					height="30"
					width="30"
					className="user-dones__avatar-image" />
				{ title }
			</span>
		);
	}

	return (
		<Card title={ title }>
			<DonesList
				userId={ userId }
				query={ { date } } />
			{ userId === USER_ID && (
				<DoneInput
					key="input"
					date={ date }
					className="user-dones__input" />
			) }
		</Card>
	);
}

export default connect( ( state, { userId } ) => getUser( state, userId ) )( UserDones );
