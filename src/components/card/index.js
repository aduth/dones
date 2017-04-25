/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classnames';

export default function Card( { className, title, subtitle, controls, children } ) {
	const classes = classNames( 'card', className );

	return (
		<section className={ classes }>
			{ title && (
				<header className="card__header">
					<div className="card__title-subtitle">
						<h4 className="card__title">
							{ title }
						</h4>
						{ subtitle && (
							<p className="card__subtitle">
								{ subtitle }
							</p>
						) }
					</div>
					{ controls && (
						<div className="card__controls">
							{ controls }
						</div>
					) }
				</header>
			) }
			{ children.length > 0 && (
				<div className="card__content">
					{ children }
				</div>
			) }
		</section>
	);
}
