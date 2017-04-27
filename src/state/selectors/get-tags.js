export default function getTags( state ) {
	const { tags } = state;
	return tags ? Object.keys( tags ) : [];
}
