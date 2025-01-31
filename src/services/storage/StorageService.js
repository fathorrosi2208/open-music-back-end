const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class StorageService {
  constructor() {
    this._pool = new Pool();
    this._folder = path.resolve(__dirname, 'api/uploads/file/images');

    this.initialize();
  }

  async initialize() {
    try {
      await fs.access(this._folder);
    } catch {
      await fs.mkdir(this._folder, { recursive: true });
    }
  }

  async uploadAlbumCover(id, file) {
    const coverFilename = `${id}-${nanoid(10)}${path.extname(file.hapi.filename)}`;
    const coverPath = path.join(this._folder, coverFilename);
    const fileStream = fsSync.createWriteStream(coverPath);

    try {
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', (err) => {
          fileStream.end();
          reject(err);
        });
        file.pipe(fileStream);
      });

      const query = {
        text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
        values: [coverFilename, id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        await fs.unlink(coverPath);
        throw new NotFoundError('Gagal mengunggah sampul. Id tidak ditemukan');
      }

      return coverFilename;
    } catch (error) {
      try {
        await fs.unlink(coverPath);
      } catch (unlinkError) {
        console.error('Gagal menghapus file setelah error:', unlinkError);
      }
      throw error;
    } finally {
      fileStream.end();
    }
  }

  async deleteAlbumCover(filename) {
    const filepath = path.join(this._folder, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

module.exports = StorageService;
