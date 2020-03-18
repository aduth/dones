/**
 * External dependencies
 */
import { createElement } from 'preact';
import { useMemo } from 'preact/hooks';
import { useSelector, useStore } from 'prsh';
import { mapValues, isPlainObject } from 'lodash-es';

export default ( mapSelectToProps, mapDispatchToProps ) => (
	WrappedComponent
) => ( props ) => {
	const { dispatch } = useStore();
	const selector = useMemo(
		() => ( state ) =>
			mapSelectToProps ? mapSelectToProps( state, props ) : {},
		[ props ]
	);
	const selectProps = useSelector( selector );

	let dispatchProps;
	if ( typeof mapDispatchToProps === 'function' ) {
		dispatchProps = mapDispatchToProps( dispatch, props );
	} else if ( isPlainObject( mapDispatchToProps ) ) {
		dispatchProps = mapValues(
			mapDispatchToProps,
			( actionCreator ) => ( ...args ) =>
				dispatch( actionCreator( ...args ) )
		);
	}

	return (
		<WrappedComponent
			{ ...props }
			{ ...selectProps }
			{ ...dispatchProps }
		/>
	);
};
