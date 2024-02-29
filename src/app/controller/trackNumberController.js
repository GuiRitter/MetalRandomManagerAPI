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

const _ = '';

const log = getLog('trackNumberController');

const pendingTrackNumberQuery = `${_
	}SELECT union_query.artist_id${_
	}, union_query.artist_name${_
	}, union_query.album_id${_
	}, union_query.album_name${_
	}, union_query.release_date${_
	}, union_query.song_id${_
	}, union_query.song_name${_
	}, union_query.song_track_side${_
	}, union_query.song_track_number${_
	}, union_query.song_track_index${_
	}, union_query.count ${_
	}FROM (${_
	}${_}SELECT al.id AS id ${_
	}${_}FROM song s ${_
	}${_}JOIN album al ON s.album = al.id ${_
	}${_}WHERE s.track_number = 0 ${_
	}${_}ORDER BY al.artist, al.release_date ${_
	}${_}LIMIT 1${_
	}) album_query ${_
	}JOIN (${_
	}${_}SELECT ar.id AS artist_id${_
	}${_}, ar.name AS artist_name${_
	}${_}, al.id AS album_id${_
	}${_}, al.name AS album_name${_
	}${_}, al.release_date${_
	}${_}, NULL AS song_id${_
	}${_}, NULL AS song_name${_
	}${_}, NULL AS song_track_side${_
	}${_}, NULL AS song_track_number${_
	}${_}, NULL AS song_track_index${_
	}${_}, CAST(NULL AS BIGINT) AS count ${_
	}${_}FROM album al ${_
	}${_}JOIN artist ar ON al.artist = ar.id ${_
	}${_
	}${_}UNION ${_
	}${_
	}${_}SELECT NULL${_// artist_id
	}${_}, NULL${_// artist_name
	}${_}, s.album${_// album_id
	}${_}, NULL${_// album_name
	}${_}, NULL${_// release_date
	}${_}, s.id${_// song_id
	}${_}, s.name${_// song_name
	}${_}, s.track_side${_// song_track_side
	}${_}, CASE WHEN s.track_number > 0 ${_
	}${_}${_}THEN s.track_number ${_
	}${_}${_}ELSE NULL ${_
	}${_}END${_// song_track_number
	}${_}, CASE WHEN s.track_index > 0 ${_
	}${_}${_}THEN s.track_index ${_
	}${_}${_}ELSE NULL ${_
	}${_}END${_// song_track_index
	}${_}, CAST(NULL AS BIGINT) ${_// count
	}${_}FROM song s ${_
	}${_
	}${_}UNION ${_
	}${_
	}${_}SELECT NULL${_// artist_id
	}${_}, NULL${_// artist_name
	}${_}, NULL${_// album_id
	}${_}, NULL${_// album_name
	}${_}, NULL${_// release_date
	}${_}, NULL${_// song_id
	}${_}, NULL${_// song_name
	}${_}, NULL${_// song_track_side
	}${_}, NULL${_// song_track_number
	}${_}, NULL${_// song_track_index
	}${_}, COUNT(*) ${_// count
	}${_}FROM song ${_
	}${_}WHERE track_number = 0${_
	}) union_query ON album_query.id = union_query.album_id OR union_query.album_id IS NULL;`;

export const getPendingTrackNumber = async (req, res) => {
	try {
		const { rows } = await dbQuery.query(pendingTrackNumberQuery);
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
		log('getPendingTrackNumber', { count, header, 'rows.length': songList.length });
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

const updateInnerQuerySansHeader = offSet => `${_
	}SELECT CAST($${offSet + 1} AS UUID)${_
	}, $${offSet + 2}${_
	}, $${offSet + 3}${_
	}, $${offSet + 4}`;

const updateInnerQueryWithHeader = offSet => `${_
	}SELECT CAST($${offSet + 1} AS UUID) AS song_id${_
	}, $${offSet + 2} AS song_track_side${_
	}, $${offSet + 3} AS song_track_number${_
	}, $${offSet + 4} AS song_track_index`;

const updateOuterQuery = innerQuery => `${_
	}UPDATE song ${_
	}SET track_side = song_track_side, ${_
	}track_number = CAST(song_track_number AS NUMERIC(5, 1)), ${_
	}track_index = CAST(song_track_index AS NUMERIC(5, 1)) ${_
	}FROM (${innerQuery}) union_data ${_
	}WHERE id = song_id ${_
	}RETURNING *;`;

export const setTrackNumber = async (req, res) => {
	const { songList } = req.body;
	log('setTrackNumber', { songList });
	const innerQuery = songList.map((_, index) => {
		const offSet = index * 3;
		return (index == 0)
			? updateInnerQueryWithHeader(offSet)
			: updateInnerQuerySansHeader(offSet);
	}).join(' UNION ');
	const innerQueryParameters = songList.flatMap(song => [song.id, song.trackSide, Number(song.trackNumber), Number(song.trackIndex)]);
	const query = updateOuterQuery(innerQuery);
	log('setTrackNumber', { query, innerQueryParameters });
	try {
		const { rows } = await dbQuery.query(query, innerQueryParameters);
		log('setTrackNumber', { 'rows.length': rows.length });
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'setTrackNumber', error, res);
	}
};
