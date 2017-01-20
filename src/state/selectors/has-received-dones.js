export default function hasReceivedDones( state, date ) {
	return !! state.dones.received[ date ];
}
