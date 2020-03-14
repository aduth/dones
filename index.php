<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<link rel="manifest" href="<?php echo get_theme_file_uri( '/manifest.json' ); ?>">
		<link rel="preload" href="<?php echo get_theme_file_uri( '/fonts/roboto.woff' ); ?>" as="font" crossorigin="anonymous">
		<link rel="preload" href="<?php echo get_theme_file_uri( '/fonts/roboto-bold.woff' ); ?>" as="font" crossorigin="anonymous">
		<style>
			@font-face {
				font-family: Roboto;
				src: url( <?php echo get_theme_file_uri( '/fonts/roboto.woff' ); ?> ) format( 'woff' );
				font-weight: normal;
				font-style: normal;
			}

			@font-face {
				font-family: Roboto;
				src: url( <?php echo get_theme_file_uri( '/fonts/roboto-bold.woff' ); ?> ) format( 'woff' );
				font-weight: bold;
				font-style: normal;
			}
		</style>
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
