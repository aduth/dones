/**
 * External dependencies
 */
import { createElement, toChildArray } from 'preact';
import classNames from 'classcat';

export default function Card( {
	className,
	title,
	subtitle,
	controls,
	children,
} ) {
	const classes = classNames( [ 'card', className ] );

	return (
		<section className={ classes }>
			{ title && (
				<header className="card__header">
					<div className="card__title-subtitle">
						<h2 className="card__title">{ title }</h2>
						{ subtitle && (
							<p className="card__subtitle">{ subtitle }</p>
						) }
					</div>
					{ controls && (
						<div className="card__controls">{ controls }</div>
					) }
				</header>
			) }
			{ toChildArray( children ).length > 0 && (
				<div className="card__content">{ children }</div>
			) }
		</section>
	);
}
