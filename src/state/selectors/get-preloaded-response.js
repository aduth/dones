export default function getPreloadedResponse( state, path ) {
	return state.requests.preload[ path ] || null;
}
