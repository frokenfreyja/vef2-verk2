CREATE TABLE applications (
  -- TODO schema fyrir töflu
  id serial primary key,
  name varchar(64) not null unique,
  email varchar(64) not null unique, 
  phone int(7),
  presentation text,
  job text, 
  processed boolean default false,
  created timestamp with time zone not null default current_timestamp
);
