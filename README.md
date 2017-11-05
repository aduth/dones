# Dones

Dones is a free team task management and tracking application to help your organization stay in-sync and on-target.

<p align="center"><img src="https://cldup.com/bLkLOS6mGf.png" width="580" alt="Screenshot"></p>

## Installation

Dones is distributed as a WordPress theme, meaning you can easily host it yourself on a number of [hosting providers](https://wordpress.org/hosting/) or VPS services ([AWS](https://aws.amazon.com/getting-started/tutorials/launch-a-wordpress-website/) and [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-use-the-wordpress-one-click-install-on-digitalocean), for example).

1. [Download a pre-built zip archive of the latest release](https://github.com/aduth/dones/releases/download/1.1.1/dones.zip).
   - Do not download from the "Clone or download" GitHub button, as this includes the source material only. Read the [Development](#development) instructions below if you're interested in building your own copy of the theme.
2. Navigate to the __Appearance > Themes__ screen in your WordPress administrative dashboard.
3. Click __Add New__ at the top of the page.
3. Click __Upload Theme__ at the top of the page.
4. Click __Choose File__, then find and __Upload__ the downloaded zip file.
5. After the theme finishes installing, click __Activate__.
6. You're done!

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
