import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('artistController');

export const getView = async (req, res) => {
	const { artist: artist, album: album, song: song } = req.query;
	log('getView', { artist, album, song });
	const query = 'SELECT * FROM artist_album_song WHERE LOWER(artist_name) like LOWER($1) AND LOWER(album_name) like LOWER($2) AND LOWER(song_name) like LOWER($3);';
	try {
		let { rows } = await dbQuery.query(query, [`%${artist || ''}%`, `%${album || ''}%`, `%${song || ''}%`]);
		log('getView', { 'rows.length': rows.length });
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getView', error, res);
	}
};

export const createArtist = async (req, res) => {
	const { name } = req.body;
	log('createArtist', { name });
	const query = 'INSERT INTO artist (name) VALUES ($1) RETURNING *;';
	try {
		const { rows } = await dbQuery.query(query, [name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createArtist', error, res);
	}
};

export const createAlbum = async (req, res) => {
	const {
		artist: artist,
		name: name,
		date: date,
		single: single,
	} = req.body;

	log('createAlbum', { artist, name, date, single });

	const releaseDate = date;
	const releaseYear = Number(date.substring(0, 4));

	log('createAlbum', { releaseDate, releaseYear });

	const query = 'INSERT INTO album (artist, name, release_date, release_year, single) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
	try {
		const { rows } = await dbQuery.query(query, [artist, name, releaseDate, releaseYear, single || false]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createAlbum', error, res);
	}
};

export const createSong = async (req, res) => {
	const {
		album: album,
		name: name,
		date: date,
		side: side,
		number: number,
		index: index,
	} = req.body;

	const step = -2;
	const rating = req.rating || null;

	log('createSong', { album, name, date, side, number, index });
	const query = 'INSERT INTO song (album, name, registered_at, track_side, track_number, track_index, step, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
	try {
		const { rows } = await dbQuery.query(query, [album, name, date, side, number, index, step, rating]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createSong', error, res);
	}
};
