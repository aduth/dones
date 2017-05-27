<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<link rel="manifest" href="<?php echo get_theme_file_uri( '/manifest.json' ); ?>">
		<style><?php @include( dirname( __FILE__ ) . '/dist/critical.css.php' ); ?></style>
		<?php wp_head() ?>
	</head>
	<body <?php body_class(); ?>>
		<div id="app">
			<!-- App Shell -->
			<main class="page">
				<header class="sidebar"></header>
			</main>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>
