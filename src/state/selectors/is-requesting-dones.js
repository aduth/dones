export default function isRequestingDones( state, date ) {
	return !! state.dones.requesting[ date ];
}
