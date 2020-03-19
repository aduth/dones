/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import Flatpickr from 'flatpickr';

/**
 * Internal dependencies
 */
import { toSiteTime, translate } from 'lib/i18n';
import Icon from 'components/icon';

function DatePicker( { value, onChange } ) {
	const input = useRef();
	const flatpickr = useRef();
	const scheduledInitialize = useRef();

	useEffect( () => {
		if ( window.requestAnimationFrame ) {
			scheduledInitialize.current = window.requestAnimationFrame( () => {
				flatpickr.current = new Flatpickr( input.current, {
					onChange,
				} );

				// By default, Flatpickr intializes to the browser-offset date.
				// Update the value and force a redraw (to reapply the "today"
				// class)
				flatpickr.current.now = toSiteTime( new Date() );

				// Override Flatpickr's mobile accessibility attributes to
				// inherit more from the base input element
				if ( flatpickr.current.mobileInput ) {
					flatpickr.current.mobileInput.removeAttribute( 'tabindex' );
					flatpickr.current.mobileInput.setAttribute(
						'aria-label',
						flatpickr.current.input.getAttribute( 'aria-label' )
					);
					flatpickr.current.input.setAttribute(
						'aria-hidden',
						'true'
					);
				}

				flatpickr.current.redraw();
			} );
		}

		return () => {
			if ( flatpickr.current ) {
				flatpickr.current.destroy();
			} else {
				window.cancelAnimationFrame( scheduledInitialize.current );
			}
		};
	}, [] );

	useEffect( () => {
		if ( flatpickr.current ) {
			flatpickr.current.setDate( value );
		}
	}, [ value ] );

	return (
		<span className="date-picker button">
			<Icon icon="calendar" size={ 12 } />
			<input
				ref={ input }
				defaultValue={ value }
				aria-label={ translate( 'Pick Date' ) }
				className="date-picker__input"
			/>
		</span>
	);
}

export default DatePicker;
