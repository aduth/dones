#### 1.1.2 (2017-11-21)

- Improved: Better support for tags including emoji 🎉
- Improved: Confirm navigation while saves are still pending
- Improved: Order users by non-empty dones
- Improved: Use appropriately sized user avatars by display pixel density
- Fix: Avoid duplicate request when updating a done
- Fix: Restrict tag suggestions to last item when results shrink
- Fix: Improve selection within nested code snippets
- Fix: Resolve issue where text cursor could jump after selecting tag
- Fix: Resolve overlapping of done input on small viewports
- Fix: Hide edit highlight for users other than own
- Fix: Resolve failing requests in older version of Microsoft Edge
- Fix: Resolve mid-text selection error in Firefox and IE
- Fix: Submitting edited done by click in macOS Firefox and Safari works correctly
- Fix: Resolve code text not displaying in IE11
- Fix: Copying done text no longer includes zero-width spaces
- Internal: Use transients for caching tags data
- Internal: Avoid user agent detection for serving modern browser build

#### 1.1.1 (2017-11-04)

- Improved: Deleting dones is now more accessible for keyboard users
- Improved: More performance enhancements (smaller bundle size)
- Fix: Tag pages no longer erroneously show placeholder

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
