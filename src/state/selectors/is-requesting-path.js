export default function isRequestingPath( state, path ) {
	return !! state.requests.items[ path ];
}
