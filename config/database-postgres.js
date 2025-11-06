const { Pool } = require('pg');

class DatabasePostgres {
  constructor() {
    this.pool = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      // Utiliser la variable d'environnement POSTGRES_URL de Vercel/Neon
      const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

      if (!connectionString) {
        reject(new Error('POSTGRES_URL ou DATABASE_URL non défini'));
        return;
      }

      this.pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      });

      this.pool.query('SELECT NOW()', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Connecté à PostgreSQL');
          resolve();
        }
      });
    });
  }

  async run(sql, params = []) {
    if (!this.pool) await this.connect();
    const result = await this.pool.query(sql, params);
    return {
      lastID: result.rows[0]?.id || null,
      changes: result.rowCount
    };
  }

  async get(sql, params = []) {
    if (!this.pool) await this.connect();
    const result = await this.pool.query(sql, params);
    return result.rows[0] || null;
  }

  async all(sql, params = []) {
    if (!this.pool) await this.connect();
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

module.exports = new DatabasePostgres();
