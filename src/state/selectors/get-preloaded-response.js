export default function getPreloadedResponse( state, path ) {
	const response = state.requests.preload[ path ];

	return response ? response.body : null;
}
