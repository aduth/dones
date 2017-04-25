export default function getPreloadedResponse( state, url ) {
	return state.requests.preload[ url ] || null;
}
