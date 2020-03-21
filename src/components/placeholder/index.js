/**
 * External dependencies
 */

export default function Placeholder( { height } ) {
	return <div style={ height ? { height } : null } className="placeholder" />;
}
