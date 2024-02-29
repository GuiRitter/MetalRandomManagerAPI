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
('G', 'good'),
('P', 'poor'),
('U', 'ugly'),
('W', 'what');

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
	Spotify boolean not null,
	track_side char not null default 'A',
	track_number numeric(5, 1) not null default 0
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

create table song_pending_action (
	id uuid default uuid_generate_v4() primary key,
	song uuid references song(id) not null,
	content text not null,
	done boolean not null default false
);
