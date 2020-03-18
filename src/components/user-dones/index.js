/**
 * External dependencies
 */
import { createElement } from 'preact';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import Card from 'components/card';
import DoneInput from 'components/done-input';
import DonesList from 'components/dones-list';
import User from 'components/user';

export default function UserDones( { userId, date } ) {
	return (
		<Card title={ <User userId={ userId } /> }>
			<DonesList userId={ userId } query={ { date } } />
			{ userId === USER_ID && (
				<DoneInput
					key="input"
					date={ date }
					className="user-dones__input"
				/>
			) }
		</Card>
	);
}
