export default function isRequestingUrl( state, url ) {
	return !! state.requests.items[ url ];
}
