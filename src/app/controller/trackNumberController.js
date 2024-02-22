import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import {
	arePasswordsEqual,
	isNonEmptyString,
	generateUserToken
} from '../helper/validation';

import { byHavingArtist, byHavingCount, byHavingSong } from '../util/crud';

import { getLog } from '../util/log';

const log = getLog('releaseDateController');

export const getPendingTrackNumber = async (req, res) => {
	// const query = `SELECT union_query.artist_id, union_query.artist_name, union_query.album_id, union_query.album_name, union_query.release_date, union_query.song_id, union_query.song_name, union_query.song_track_side, union_query.song_track_number, union_query.count FROM (SELECT album as id FROM song WHERE track_number = 0 LIMIT 1) album_query JOIN (SELECT ar.id AS artist_id, ar.name AS artist_name, al.id AS album_id, al.name AS album_name, al.release_date, NULL AS song_id, NULL AS song_name, NULL AS song_track_side, NULL AS song_track_number, 0 AS count FROM album al JOIN artist ar ON al.artist = ar.id UNION SELECT NULL, NULL, s.album, NULL, NULL, s.id, s.name, s.track_side, s.track_number, 0 FROM song s UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, COUNT(*) FROM song WHERE track_number = 0) union_query ON album_query.id = union_query.album_id OR union_query.album_id IS NULL;`;
	const query = `SELECT union_query.artist_id, union_query.artist_name, union_query.album_id, union_query.album_name, union_query.release_date, union_query.song_id, union_query.song_name, union_query.song_track_side, union_query.song_track_number, union_query.count FROM (SELECT UUID('34d35d83-2b97-4f10-afb0-8431f5aa3b57') AS id) album_query JOIN (SELECT ar.id AS artist_id, ar.name AS artist_name, al.id AS album_id, al.name AS album_name, al.release_date, NULL AS song_id, NULL AS song_name, NULL AS song_track_side, NULL AS song_track_number, 0 AS count FROM album al JOIN artist ar ON al.artist = ar.id UNION SELECT NULL, NULL, s.album, NULL, NULL, s.id, s.name, s.track_side, s.track_number, 0 FROM song s UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, COUNT(*) FROM song WHERE track_number = 0) union_query ON album_query.id = union_query.album_id OR union_query.album_id IS NULL;`;
	try {
		const { rows } = await dbQuery.query(query);
		const count = rows.filter(byHavingCount).pop().count;

		const header = rows.filter(byHavingArtist).pop();
		delete header.song_id;
		delete header.song_name;
		delete header.song_track_side;
		delete header.song_track_number;
		delete header.count;
		
		const songList = rows.filter(byHavingSong).map(song => {
			delete song.artist_id;
			delete song.artist_name;
			delete song.album_id;
			delete song.album_name;
			delete song.release_date;
			delete song.count;
			return song;
		});
		log('getPage', { count, header, 'rows.length': songList.length });
		return res.status(status.success).send({
			count,
			header,
			songList
		});
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export const setTrackNumber = async (req, res) => {
	const { songList } = req.body;
	log('setReleaseDate', { songList });
	const innerQuery = songList.map((song, index) => {
		const offSet = index * 3;
		return (index == 0)
			? `SELECT uuid($${offSet + 1}) AS song_id, $${offSet + 2} AS song_track_side, $${offSet + 3} AS song_track_number`
			: `SELECT uuid($${offSet + 1}), $${offSet + 2}, $${offSet + 3}`;
	}).join(' UNION ');
	const innerQueryParameters = songList.flatMap(song => [song.id, song.trackSide, song.trackNumber]);
	const query = `UPDATE song SET track_side = song_track_side, track_number = song_track_number FROM (${innerQuery}) union_data WHERE id = song_id RETURNING *;`;
	try {
		const { rows } = await dbQuery.query(query, innerQueryParameters);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getPage', error, res);
	}
};
