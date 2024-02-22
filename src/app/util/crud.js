export const byHavingArtist = row => row.artist_id;

export const byHavingCount = row => row.count;

export const byHavingSong = row => row.song_id;

export const byNotHavingCount = row => !row.count;

export const withoutCount = row => {
	delete row.count;
	return row;
};

export const getRowsWithCount = rows => ({
	count: rows.filter(byHavingCount).pop().count,
	rows: rows.filter(byNotHavingCount).map(withoutCount)
});
