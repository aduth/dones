/**
 * Returns true if tags have been received, or false otherwise.
 *
 * @param  {Object}  state Global state object
 * @return {boolean}       Whether tags received
 */
export default function hasReceivedTags( state ) {
	return null !== state.tags;
}
