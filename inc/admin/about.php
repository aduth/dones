<?php
/**
 * Dones post-activation admin About page.
 *
 * @package dones
 */

defined( 'ABSPATH' ) || die();

?>

<section class="about-dones wrap">
	<header class="about-dones__header">
		<div class="about-dones__brand">
			<img
				src="<?php echo get_theme_file_uri( '/img/logo-white.svg' ); ?>"
				alt="Dones"
				width="80"
				height="80">
		</div>
		<h1 class="about-dones__heading">
			<?php esc_html_e( 'Welcome to Dones', 'dones' ); ?>
		</h1>
	</header>
	<p>
		<?php
		echo wp_kses( __(
			'Dones is not a typical WordPress theme, and isn’t intended to be used for your company’s marketing page or your personal blog. Rather, Dones is an application to help you and your team manage and record the progress of your tasks and projects. It serves as a running record of your team’s goals and accomplishments. It is not too much unlike a to-do list (or a <em>dones</em> list, if you will). With an emphasis on collaboration, tagging, and aggregating, Dones helps organize and keep your team in sync.',
			'dones'
		), array( 'em' => array() ) );
		?>
	</p>
	<img
		src="<?php echo get_theme_file_uri( '/img/screenshot.png' ); ?>"
		alt="Dones"
		width="320"
		height="224"
		class="about-dones__screenshot">
	<p>
		<?php
		echo wp_kses( sprintf(
			/* translators: About page refer to add users */
			__(
				'To start using Dones, begin by <a href="%s">adding user accounts</a> for each member of your team, assigning any user role with permission to create posts (Contributor or above). Newly created users will appear automatically on the front page of your site. Once they have logged in, members of your team can immediately start adding new "dones" to record their progress.',
				'dones'
			),
			admin_url( 'user-new.php' )
		), array( 'a' => array( 'href' => array() ) ) );
		?>
	</p>
	<p>
		<?php
		echo wp_kses( sprintf(
			/* translators: About page refer to Customizer */
			__(
				'Next, head on over to the <a href="%s">Customizer</a>, where you’ll find options to change the primary color of the site and site logo to match your team or company’s brand.',
				'dones'
			),
			add_query_arg( 'return', urlencode( remove_query_arg( wp_removable_query_args(), wp_unslash( $_SERVER['REQUEST_URI'] ) ) ), admin_url( 'customize.php' ) )
		), array( 'a' => array( 'href' => array() ) ) );
		?>
	</p>
	<div class="wp-clearfix"></div>
	<h2>
		<?php esc_html_e( 'Frequently Asked Questions', 'dones' ); ?>
	</h2>
	<dl class="about-dones__faq">
		<dt><?php esc_html_e( 'How do I make my site private?', 'dones' ); ?></dt>
		<dd>
			<?php
			echo wp_kses(
				sprintf(
					/* translators: About page authenticated page views advice */
					__(
						'The Dones theme does not include any features to turn your site private, so anyone can view your history if you choose to host your site publicly. It’s up to you to decide how to authorize visitors to your site. You may choose to host the site on an internal network, configure your web server to implement <a href="%1$s">basic authentication</a>, or <a href="%2$s">search for a plugin</a> that provides privacy options as a feature. See <strong><a href="%3$s">Tip: Private Site</a></strong> for more information.',
						'dones'
					),
					'https://en.wikipedia.org/wiki/Basic_access_authentication',
					admin_url( 'plugin-install.php' ),
					'https://github.com/aduth/dones/wiki/Tip:-Private-Site'
				),
				array(
					'a'      => array( 'href' => array() ),
					'strong' => array(),
				)
			);
			?>
		</dd>
		<dt><?php esc_html_e( 'Where are the Posts and Pages menu links?', 'dones' ); ?></dt>
		<dd>
			<?php
			echo wp_kses( sprintf(
				/* translators: About page refer to theme switch */
				__(
					'You should find that most of what you want to achieve is available from the front page of your site. <a href="%1$s">Posts</a> and <a href="%2$s">pages</a> screens are removed from the administration dashboard menu while the Dones theme is active because they are neither relevant nor supported for the theme. You’re always free to <a href="%3$s">switch to another theme</a> if Dones is not the right fit for you and your team.',
					'dones'
				),
				admin_url( 'edit.php' ),
				admin_url( 'edit.php?post_type=page' ),
				admin_url( 'themes.php' )
			), array( 'a' => array( 'href' => array() ) ) );
			?>
		</dd>
		<dt><?php esc_html_e( 'Does Dones integrate with other software I use?', 'dones' ); ?></dt>
		<dd>
			<?php
			echo wp_kses( sprintf(
				/* translators: About page integrations */
				__(
					'Yes! <a href="%1$s">Head on over to the wiki</a>, where you’ll find recipes for common integrations such as a <a href="%2$s">Slack slash command</a>, <a href="%3$s">Alfred workflow</a>, or <a href="%4$s">terminal command</a>.',
					'dones'
				),
				'https://github.com/aduth/dones/wiki',
				'https://github.com/aduth/dones/wiki/Integration:-Slack',
				'https://github.com/aduth/dones/wiki/Integration:-Alfred',
				'https://github.com/aduth/dones/wiki/Integration:-Terminal'
			), array( 'a' => array( 'href' => array() ) ) );
			?>
		</dd>
	</dl>
</section>
