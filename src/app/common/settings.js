export const API_URL = 'https://guilherme-alan-ritter.net/metal_random_manager/api';

export const SPOTIFY = {
	ID: {
		NOT_ON_SPOTIFY: 'not on Spotify',
		NOT_SEARCHED: 'not searched',
	},
	SCOPES: 'playlist-read-private playlist-modify-private',
	TOKEN: {
		KEY: 'Spotify token',
		RESPONSE: {
			DATA_KEY: 'data',
			TOKEN_KEY: 'access_token',
		},
	},
	URL: {
		API: {
			AUTHORIZE: 'https://accounts.spotify.com/authorize',
			TRACKS: id => `https://api.spotify.com/v1/playlists/${id}/tracks`,
			TOKEN: 'https://accounts.spotify.com/api/token',
			PLAYLIST_LIST: 'https://api.spotify.com/v1/me/playlists',
		},
	},
};

export const WEB_URL = 'https://guilherme-alan-ritter.net/metal_random_manager';
