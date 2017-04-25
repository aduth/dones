/**
 * External dependencies
 */
import { createStore, applyMiddleware } from 'redux';
import { flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import middlewares from './middlewares';

export default function configureReduxStore() {
	const enhancers = [ applyMiddleware( ...middlewares ) ];

	if ( global.__REDUX_DEVTOOLS_EXTENSION__ ) {
		enhancers.push( global.__REDUX_DEVTOOLS_EXTENSION__() );
	}

	return createStore( reducer, flowRight( enhancers ) );
}
