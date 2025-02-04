const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlbumExist(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addAlbumLike(albumId, userId) {
    await this.verifyAlbumExist(albumId);

    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new InvariantError('Album sudah disukai');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteAlbumLike(albumId, userId) {
    await this.verifyAlbumExist(albumId);

    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal batal menyukai album');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    await this.verifyAlbumExist(albumId);

    let likes;
    let isCache = false;
    const cacheKey = `albumLikes:${albumId}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      likes = Number(result);
      isCache = true;
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      likes = Number(result.rows[0].count);

      await this._cacheService.set(cacheKey, likes, 1800);
    }

    return { likes, isCache };
  }
}

module.exports = UserAlbumLikesService;
