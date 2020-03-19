describe( 'Create done', () => {
	before( () => {
		cy.visit( '/' );
	} );

	it( 'Redirects to current date', () => {
		cy.url().should( 'match', /\/date\/\d{4}-\d{2}-\d{2}\/$/ );
	} );

	it( 'Autofocuses input', () => {
		cy.get( ':focus' ).type( '`Auto` focus{enter}' );
		cy.get( '.done-text' )
			.should( 'have.length', 1 )
			.and( 'have.text', '​Auto​ focus' );
		cy.get( '.done-text code' ).should( 'have.length', 1 );
		cy.get( '.done-input__textarea-input:focus' ).and( 'have.value', '' );
	} );

	it( 'Edits done', () => {
		cy.get( '.done-text' ).focus();
		cy.get( '.done-input__textarea-input:focus' ).type(
			' with #tag!{enter}'
		);
		cy.get( '.dones-list__item' )
			.should( 'have.length', 1 )
			.and( 'have.text', '​Auto​ focus with #tag!' );
		cy.get( '.done-text code' ).should( 'have.length', 1 );
		cy.get( '.done-text a' ).should( 'have.length', 1 );
	} );
} );
