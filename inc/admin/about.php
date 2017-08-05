<section class="about-dones wrap">
	<header class="about-dones__header">
		<div class="about-dones__brand">
			<img
				src="<?php echo get_theme_file_uri( '/img/logo-white.svg' ) ?>"
				alt="Dones"
				width="80"
				height="80">
		</div>
		<h1 class="about-dones__heading">
			<?php esc_html_e( 'Welcome to Dones', 'dones' ); ?>
		</h1>
	</header>
	<p>
		<?php echo wp_kses( __(
			'Dones is not a typical WordPress theme. It\'s not optimized to be used for your company\'s marketing page or your personal blog. Rather, Dones is an application to help you and your team manage and record the progress of your tasks and projects. It serves as a running record of your team\'s goals and accomplishments. It is not too much unlike a to-do list (or a <em>dones</em> list, if you will). With an emphasis on collaboration, tagging, and aggregating, Dones helps organize and keep your team in sync.',
			'dones'
		), array( 'em' => array() ) ); ?>
	</p>
	<img
		src="<?php echo get_theme_file_uri( '/img/screenshot.png' ) ?>"
		alt="Dones"
		width="320"
		height="224"
		class="about-dones__screenshot">
	<p>
		<?php echo wp_kses( sprintf(
			__(
				'To start using Dones, begin by <a href="%s">adding user accounts</a> for each member of your team, assigning any user role with permission to create posts (Contributor or above). Newly created users will appear automatically on the front page of your site. Once they have logged in, members of your team can immediately start adding new "dones" to record their progress.',
				'dones'
			),
			admin_url( 'user-new.php' )
		), array( 'a' => array( 'href' => array() ) ) ); ?>
	</p>
	<p>
		<?php echo wp_kses( sprintf(
			__(
				'Next, head on over to the <a href="%s">Customizer</a>, where you\'ll find options to change the primary color of the site and site logo to match your team or company\'s brand.',
				'dones'
			),
			add_query_arg( 'return', urlencode( remove_query_arg( wp_removable_query_args(), wp_unslash( $_SERVER['REQUEST_URI'] ) ) ), admin_url( 'customize.php' ) )
		), array( 'a' => array( 'href' => array() ) ) ); ?>
	</p>
	<div class="wp-clearfix"></div>
	<h2>
		<?php esc_html_e( 'Frequently Asked Questions', 'dones' ); ?>
	</h2>
	<dl class="about-dones__faq">
		<dt><?php esc_html_e( 'How do I make my site private?', 'dones' ); ?></dt>
		<dd>
			<?php echo wp_kses( sprintf(
				__(
					'The Dones theme does not include any features to turn your site private, so anyone can view your history if you choose to host your site publicly. It\'s up to you to decide how to authorize visitors to your site. You may choose to host the site on an internal network, configure your web server to implement <a href="%s">basic authentication</a>, or <a href="%s">search for a plugin</a> that provides privacy options as a feature.',
					'dones'
				),
				'https://en.wikipedia.org/wiki/Basic_access_authentication',
				admin_url( 'plugin-install.php' )
			), array( 'a' => array( 'href' => array() ) ) ); ?>
		</dd>
		<dt><?php esc_html_e( 'Where are the Posts and Pages menu links?', 'dones' ); ?></dt>
		<dd>
			<?php echo wp_kses( sprintf(
				__(
					'You should find that most of what you want to achieve is available from the front page of your site. <a href="%s">Posts</a> and <a href="%s">pages</a> screens are removed from the administration dashboard menu while the Dones theme is active because they are neither relevant nor supported for the theme. You\'re always free to <a href="%s">switch to another theme</a> if Dones is not the right fit for you and your team.',
					'dones'
				),
				admin_url( 'edit.php' ),
				admin_url( 'edit.php?post_type=page' ),
				admin_url( 'themes.php' )
			), array( 'a' => array( 'href' => array() ) ) ); ?>
		</dd>
		<dt><?php esc_html_e( 'Why does «insert plugin here» not work with Dones?', 'dones' ); ?></dt>
		<dd>
			<?php esc_html_e(
				'While the Dones theme does not prevent plugins from loading, it was built in such a way to optimize for speed and user interaction at the expense of complete plugin interoperability.',
				'dones'
			); ?>
		</dd>
	</dl>
</section>
