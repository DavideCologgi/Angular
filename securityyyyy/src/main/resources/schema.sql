DROP SCHEMA IF EXISTS eventify CASCADE;

CREATE SCHEMA IF NOT EXISTS eventify;

-- CREATE TABLE IF NOT EXISTS eventify.photo (
-- 	id BIGSERIAL NOT NULL PRIMARY KEY,
-- 	photo_name varchar(255) NOT NULL,
-- 	photo_type varchar(255) NOT NULL,
-- 	data BIGINT NOT NULL,
-- 	is_deleted BOOLEAN NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS eventify.user (
-- 	id BIGSERIAL NOT NULL PRIMARY KEY,
-- 	firstName varchar(100) NOT NULL,
-- 	lastName varchar(100) NOT NULL,
-- 	password varchar(100) NOT NULL,
-- 	dob DATE NOT NULL,
-- 	email VARCHAR(255) NOT NULL UNIQUE,
-- 	profile_picture BIGINT REFERENCES eventify.photo(id)
-- );
