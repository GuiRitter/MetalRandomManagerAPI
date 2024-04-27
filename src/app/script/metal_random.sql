-- sudo -u postgres createdb metal_random

-- sudo -u postgres psql metal_random

CREATE EXTENSION "uuid-ossp";

-- psql metal_random

create table ´user´ (
	login text primary key,
	password text not null
);

create table step (
	code smallint primary key,
	description text not null
);

insert into step (code, description)
values (-2, 'to watch'),
(-1, 'to download'),
(0, 'to listen'),
(1, 'to cover'),
(2, 'to tag'),
(3, 'to rename');

create table rating (
	id char primary key,
	name text not null
);

insert into rating (id, name)
values ('B', 'best'),
('E', 'easy'),
('H', 'hard'),
('R', 'rare');

create table artist (
	id uuid default uuid_generate_v4() primary key,
	name text not null
);

create table album (
	id uuid default uuid_generate_v4() primary key,
	artist uuid references artist(id) not null,
	name text not null,
	release_date text null,
	release_year text null,
	single boolean not null default false
);

create table song (
	id uuid default uuid_generate_v4() primary key,
	album uuid references album(id) not null,
	name text not null,
	step smallint references step(code) not null,
	registered_at text null,
	rating char references rating(id) null,
	Spotify boolean null,
	track_side char not null default 'A',
	track_number numeric(5, 1) not null default 0,
	track_index numeric(5, 1) not null default 0
);

create table album_note (
	id uuid default uuid_generate_v4() primary key,
	album uuid references album(id) not null,
	content text not null
);

create table song_note (
	id uuid default uuid_generate_v4() primary key,
	song uuid references song(id) not null,
	content text not null
);

create table album_pending_action (
	id uuid default uuid_generate_v4() primary key,
	album uuid references album(id) not null,
	content text not null,
	done boolean not null default false
);

create table song_pending_action (
	id uuid default uuid_generate_v4() primary key,
	song uuid references song(id) not null,
	content text not null,
	done boolean not null default false
);

create view artist_album_song as
select ar.id as artist_id
, ar.name as artist_name
, al.id as album_id
, al.name as album_name
, al.release_year
, al.release_date
, al.single
, s.id as song_id
, s.name as song_name
, s.step
, s.registered_at
, s.rating
, s.Spotify
, s.track_side
, s.track_number
, s.track_index
from artist ar
join album al on ar.id = al.artist
join song s on al.id = s.album;

-- generate list to compare with Spotify

SELECT s.name
|| E'\t'
|| ar.name
|| E'\t'
|| ROW_NUMBER() OVER(ORDER BY s.rating, al.release_date, s.track_index, al.name)
|| E'\t'
|| CASE WHEN s.spotify IS NULL THEN 'n' WHEN s.spotify IS TRUE THEN 't' ELSE 'f' END
|| E'\t'
|| s.id
FROM song s
JOIN album al ON s.album = al.id
JOIN artist ar on al.artist = ar.id
WHERE s.Spotify IS NOT FALSE
AND s.step < 99
AND s.rating in ('B', 'E', 'H', 'R')
ORDER BY s.rating
, al.release_date
, s.track_index
, al.name;

-- generate list of pending to add to Spotify

SELECT '/* '
|| ROW_NUMBER() OVER(ORDER BY s.rating, al.release_date, s.track_index, al.name)
|| ' '
|| s.step
|| ' '
|| s.name
|| ' _ '
|| ar.name
|| ' */ UPDATE song SET Spotify = true WHERE id = '''
|| s.id
|| ''' returning *;'
FROM song s
JOIN album al ON s.album = al.id
JOIN artist ar ON al.artist = ar.id
WHERE s.step < 99
AND s.rating IN ('B', 'G')
AND Spotify IS NULL
ORDER BY s.rating
, al.release_date
, s.track_index
, al.name;
