export default function getDone( state, id ) {
	return state.dones.items[ id ] || null;
}
