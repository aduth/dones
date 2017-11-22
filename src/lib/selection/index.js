/**
 * Returns a tuple of start and end offset for the current selection
 *
 * @see https://stackoverflow.com/a/4812022/995445
 *
 * @param  {?Element} referenceNode Optional node from which to get offset.
 *                                  Defaults to range common ancestor.
 * @return {Number[]}               Tuple of start and end offset
 */
export function getSelectedOffset( referenceNode ) {
	const selection = window.getSelection();
	if ( selection.rangeCount === 0 ) {
		return [ 0, 0 ];
	}

	const range = selection.getRangeAt( 0 );
	const rangeBeforeCaret = range.cloneRange();
	const node = referenceNode || range.commonAncestorContainer;
	rangeBeforeCaret.selectNodeContents( node );
	rangeBeforeCaret.setEnd( range.startContainer, range.startOffset );
	const start = rangeBeforeCaret.toString().length;
	rangeBeforeCaret.setEnd( range.endContainer, range.endOffset );
	const end = rangeBeforeCaret.toString().length;

	return [ start, end ];
}
