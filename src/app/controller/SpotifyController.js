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

import { getLog } from '../util/log';

const log = getLog('SpotifyController');

export const getToken = async (req, res) => {
	const query = `SELECT value FROM registry WHERE key LIKE 'client_secret';`;
	try {
		const { rows } = await dbQuery.query(query);
		const log = getLog('getToken', rows);
	} catch (error) {
		return buildError(log, 'getToken', error, res);
	}
};
