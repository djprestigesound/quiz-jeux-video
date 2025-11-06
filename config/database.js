// Auto-détection : PostgreSQL en production, SQLite en local
const usePostgres = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (usePostgres) {
  console.log('🔵 Mode PRODUCTION : PostgreSQL');
  module.exports = require('./database-postgres');
} else {
  console.log('🟢 Mode LOCAL : SQLite');

  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const config = require('./config');

  class Database {
    constructor() {
      this.db = null;
    }

    connect() {
      return new Promise((resolve, reject) => {
        const dbPath = path.join(__dirname, '..', config.dbPath);
        this.db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Connecté à la base de données SQLite');
            resolve();
          }
        });
      });
    }

    run(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        });
      });
    }

    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    }

    all(sql, params = []) {
      return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    close() {
      return new Promise((resolve, reject) => {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }

  module.exports = new Database();
}
