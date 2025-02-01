const autoBind = require('auto-bind');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, validator) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    this._validator.validateUserAlbumLikesPayload(request.payload);

    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._userAlbumLikesService.addAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    this._validator.validateUserAlbumLikesPayload(request.payload);

    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._userAlbumLikesService.deleteAlbumLike(albumId, userId);

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  }

  async getAlbumLikesHandler(request) {
    const { id: albumId } = request.params;
    const likes = await this._userAlbumLikesService.getAlbumLikes(albumId);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = UserAlbumLikesHandler;
