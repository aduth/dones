const config = global.dones || {};

export const SITE_NAME = config.siteName;
export const SITE_URL = config.siteUrl;
export const API_ROOT = config.apiRoot;
export const API_NONCE = config.apiNonce;
export const DONE_API_ROOT = `${ API_ROOT }/dones/v1`;
export const BRAND_COLOR = config.brandColor;
export const LOGO = config.logo;
export const I18N = config.i18n;
export const PRELOADED_REQUESTS = config.preload;
export const GMT_OFFSET = Number( config.gmtOffset );
export const DATE_FORMAT = config.dateFormat;
export const USER_ID = Number( config.userId );
export const LOGIN_URL = config.loginUrl;
export const LOGOUT_URL = config.logoutUrl;
