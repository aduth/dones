/**
 * External dependencies
 */
import { createElement } from 'preact';
import { over, compact } from 'lodash';
import { useEffect, useRef } from 'preact/hooks';
import classcat from 'classcat';

function AutosizeTextarea( { className, value, onInput, ...additionalProps } ) {
	const node = useRef();

	useEffect( resize, [ value ] );

	function resize() {
		node.current.style.height = '0';
		node.current.style.height = node.current.scrollHeight + 'px';
	}

	const classes = classcat( [ 'autosize-textarea', className ] );

	return (
		<textarea
			ref={ node }
			{ ...additionalProps }
			onInput={ over( compact( [ resize, onInput ] ) ) }
			value={ value }
			className={ classes }
		/>
	);
}

export default AutosizeTextarea;
