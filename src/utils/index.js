const mapAlbumsDBToModel = ({
  id,
  name,
  year,
  coverUrl,
}) => ({
  id,
  name,
  year,
  coverUrl,
});

const mapSongsDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapPlaylistsDBToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapPlaylistSongActivitiesDBToModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapAlbumsDBToModel, mapSongsDBToModel, mapPlaylistsDBToModel, mapPlaylistSongActivitiesDBToModel,
};
