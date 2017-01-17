/**
 * External dependencies
 */
import { h, render, Component } from 'preact';

export default class Portal extends Component {
	componentDidMount() {
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );
		this.renderChildren();
	}

	componentDidUpdate() {
		this.renderChildren();
	}

	componentWillUnmount() {
		if ( this.container ) {
			document.body.removeChild( this.container );
		}
	}

	renderChildren() {
		this.children = render( <div { ...this.props } />, this.container, this.children );
	}

	render() {
		return null;
	}
}
