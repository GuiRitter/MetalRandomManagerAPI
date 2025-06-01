import dbQuery from '../db/dev/dbQuery';

import {
	errorMessage,
	status
} from '../helper/status';

import * as step from '../common/step';

export const getList = async (req, res) => {
	const query = 'SELECT s.id, s.name AS song, ar.name AS artist, al.name AS album, al.release_date, s.registered_at, s.step FROM song s JOIN album al ON s.album = al.id JOIN artist ar ON al.artist = ar.id WHERE s.step = -2 ORDER BY s.step, (CASE WHEN s.registered_at IS NULL THEN 0 ELSE 1 END), s.registered_at, al.release_date, al.name, ar.name, s.name';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export const setStep = async (req, res) => {
	const { songId, newStep } = req.body;
	let newStepAsNumber = Number(newStep);
	if (((newStepAsNumber < step.TO_WATCH) || (newStepAsNumber > step.DONE)) && (newStepAsNumber != step.NOT_SELECTED)) {
		errorMessage.error = 'Invalid step code.';
		return res.status(status.bad).send(errorMessage);
	}
	const query = 'UPDATE song SET step = $1 WHERE id = $2';
	try {
		const { rows } = await dbQuery.query(query, [newStepAsNumber, songId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

