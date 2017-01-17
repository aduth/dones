export default function getUserDones( state, userId, date ) {
	if ( ! state.dones.items[ date ] ) {
		return null;
	}

	return state.dones.items[ date ][ userId ] || [];
}
