const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'userAlbumLikes',
  version: '1.0.0',
  register: async (server, { userAlbumLikesService, validator }) => {
    const userAlbumLikesHandler = new UserAlbumLikesHandler(userAlbumLikesService, validator);
    server.route(routes(userAlbumLikesHandler));
  },
};
