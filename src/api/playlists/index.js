/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, playlistSongsService, validator);
    server.route(routes(playlistsHandler));
  },
};
