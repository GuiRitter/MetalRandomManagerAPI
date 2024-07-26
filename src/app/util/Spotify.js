export const buildPendingIdRow = item => {
	const track = item.track;

	const album = track.album;

	const artistList = album.artists;

	const artist = artistList.map(toName).join(' _ ');

	return {
		match_string: `${artist} · ${track.name}`,
		disc_number: track.disc_number,
		track_number: track.track_number,
		id: track.id,
		album: album.name,
	};
};

export const toName = object => object.name;
