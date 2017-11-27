# Dones

Dones is a free team task management and tracking application to help your organization stay in-sync and on-target.

<p align="center"><img src="https://cldup.com/bLkLOS6mGf.png" width="580" alt="Screenshot"></p>

## About

Dones is not a typical WordPress theme, and won't work well for your company's marketing page or your personal blog. Rather, Dones is an application to help you and your team manage and record the progress of your tasks and projects. It serves as a running record of your team's goals and accomplishments. It is not too much unlike a to-do list (or a _dones_ list, if you will). With an emphasis on collaboration, tagging, and aggregating, Dones helps organize and keep your team in sync.

## Installation

Dones is distributed as a WordPress theme, meaning you can easily host it yourself on a number of [hosting providers](https://wordpress.org/hosting/) or VPS services ([AWS](https://aws.amazon.com/getting-started/tutorials/launch-a-wordpress-website/) and [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-the-wordpress-one-click-install-on-digitalocean), for example).

1. [Download a pre-built zip archive of the latest release](https://dones.now.sh).
   - Do not download from the "Clone or download" GitHub button, as this includes the source material only. Read the [Development](#development) instructions below if you're interested in building your own copy of the theme.
2. Navigate to the __Appearance > Themes__ screen in your WordPress administrative dashboard.
3. Click __Add New__ at the top of the page.
3. Click __Upload Theme__ at the top of the page.
4. Click __Choose File__, then find and __Upload__ the downloaded zip file.
5. After the theme finishes installing, click __Activate__.
6. You're done!

## Setup

To start using Dones, begin by adding user accounts for each member of your team, assigning any user role with permission to create posts (Contributor or above). Newly created users will appear automatically on the front page of your site. Once they have logged in, members of your team can immediately start adding new "dones" to record their progress.

Next, head on over to the [Customizer](https://codex.wordpress.org/Appearance_Customize_Screen), where you'll find options to change the primary color of the site and site logo to match your team or company's brand.

## Frequently Asked Questions

**Why should my team use Dones?**

Dones seeks to occupy a small part of your effective day while simultaneously providing critical insight to a seemingly simple question: What has my team been doing lately? Its simple interface and tools provides you with the flexibility to organize your team's activities as you see fit, without feeling like a chore or bogging you down with clutter and confusion.

**How does Dones compare to other task tracking solutions?**

Dones aims to solve a simple problem, and solve it well. While similar platforms share a common basic feature set, I frequently find that they underperform, suffer from reliability issues, and generally work as a barrier to productivity. Feeling blocked by these common frustrations, I sought to create a solution which targeted the workflow of the daily user, performing well and optimizing for bulk entry and review.

**Does Dones integrate with other software I use?**

Because it was built on the WordPress platform, Dones can take advantage of a rich ecosystem of plugins and core software functionality to fit seamlessly into your existing workflow. The [wiki](https://github.com/aduth/dones/wiki) includes recipes for common integrations, such as a [Slack slash command](https://github.com/aduth/dones/wiki/Integration:-Slack), [Alfred workflow](https://github.com/aduth/dones/wiki/Integration:-Alfred), or [terminal command](https://github.com/aduth/dones/wiki/Integration:-Terminal).

**How do I make my site private?**

The Dones theme does not include any features to turn your site private, so anyone can view your history if you choose to host your site publicly. It's up to you to decide how to authorize visitors to your site. You may choose to host the site on an internal network, configure your web server to implement [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication), or [search for a plugin](https://wordpress.org/plugins/) that provides privacy options as a feature. See [**Tip: Private Site**](https://github.com/aduth/dones/wiki/Tip:-Private-Site) for more information.

**Where are the Posts and Pages menu links?**

You should find that most of what you want to achieve is available from the front page of your site. Posts and pages screens are removed from the administration dashboard menu while the Dones theme is active because they are neither relevant nor supported for the theme.

**Why does «insert plugin here» not work with Dones?**

While the Dones theme does not prevent plugins from loading, it was built in such a way to optimize for speed and user interaction, which may compromise complete plugin interoperability.

## Development

[![Build Status](https://travis-ci.org/aduth/dones.svg?branch=master)](https://travis-ci.org/aduth/dones)

Dones is primarily a single-page application written in JavaScript using [Preact](https://preactjs.com/) and [Redux](http://redux.js.org/). You'll need to have [Node.js](https://nodejs.org/en/) installed before getting started, in addition to a WordPress environment of your choosing. You may consider [Desktop Server](https://serverpress.com/get-desktopserver/), [WP Docker](https://github.com/10up/wp-local-docker), or [VVV](https://github.com/Varying-Vagrant-Vagrants/VVV) if you don't already have a local WordPress environment.

Once you have a local WordPress environment and Node.js, clone the repository into your installation's `wp-content/themes` directory and install its dependencies:

```sh
cd wp-content/themes
git clone https://github.com/aduth/dones.git
cd dones
npm install
```

Once installed, you can generate a production build distributable by running `npm run build`, or a development copy with automatic rebuild by running `npm run dev`. Tests can be run via `npm test`.

## License

Licensed under [GNU General Public License v2 (or later)](./LICENSE.md).
