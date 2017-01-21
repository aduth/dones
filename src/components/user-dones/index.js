/**
 * External dependencies
 */
import { h } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import Card from 'components/card';
import DoneInput from 'components/done-input';
import DonesList from 'components/dones-list';
import QueryTags from 'components/query-tags';
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
			<DonesList userId={ userId } date={ date } />
			{ userId === USER_ID && [
				<QueryTags
					key="tags" />,
				<DoneInput
					key="input"
					date={ date }
					className="user-dones__input" />
			] }
		</Card>
	);
}

export default connect( ( state, { userId } ) => getUser( state, userId ) )( UserDones );
