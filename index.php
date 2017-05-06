<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<?php wp_head() ?>
	</head>
	<body <?php body_class(); ?>>
		<div id="app"></div>
		<?php wp_footer(); ?>
	</body>
</html>
