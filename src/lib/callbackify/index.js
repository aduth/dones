/**
 * Convert specified promise resolution to Node-style callback.
 *
 * @param  {Promise}  promise  Promise object
 * @param  {Function} callback Node-style callback function
 */
export default function callbackify( promise, callback ) {
	promise.then(
		( result ) => callback( null, result ),
		( error ) => callback( error )
	);
}
