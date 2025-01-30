const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistSongsPayload(request.payload);
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const userId = request.auth.credentials.id;

    const message = {
      userId,
      playlistId,
      targetEmail,
    };

    await this._service.sendMessage('export:playlistSongs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
