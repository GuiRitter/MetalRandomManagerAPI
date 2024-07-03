export const SPOTIFY = {
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
			TOKEN: 'https://accounts.spotify.com/api/token',
			PLAYLIST_LIST: 'https://api.spotify.com/v1/me/playlists'
		},
		REDIRECT: 'https://guilherme-alan-ritter.net/test_bench'
	},
};
