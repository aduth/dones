#### 1.1.0 (2017-08-04)

- New: An "About Dones" information screen is shown after activating the theme
- New: Dones branding replaces the WordPress logo on the login form
- Improved: A notice will be shown if a done fails to save
- Improved: Many, many performance optimizations
   - Hovering over a link will preload data for that next page ahead of time, so in most cases it's available immediately upon click
   - Fixed an issue which would cause a brief flicker when first visiting the page. The application should now appear intantaneously.
   - Avoid loading polyfill for browsers which support required features
- Fix: Tags can include dashes
- Internal: Created separate browser-specific code bundles (smaller size for modern browsers)

#### 1.0.4 (2017-05-29)

- Fix: Future dones or goals are displayed correctly
- Fix: Main query suppression should apply only to front-end, not admin

#### 1.0.3 (2017-05-27)

- Fix: Correct positioning of desktop dones input autocomplete

#### 1.0.2 (2017-05-27)

- New: Add web app manifest
- Fix: Dones receiving focus will no longer display input when not editable
- Fix: Corrected horizontal direction of tooltips
- Fix: Meta tags for fallback mobile site icons are output correctly
- Fix: Resolve warning logged by capabilities index access
- Fix: Omit `.DS_Store` files from pregenerated zip file
- Fix: Correctly assign date picker mobile input accessibility attributes
- Internal: A plethora of changes to squeeze more speed

#### 1.0.1 (2017-05-22)

- Fix: Tag detail page will correctly filter dones with punctuation following tag

#### 1.0.0 (2017-05-20)

- Initial release
