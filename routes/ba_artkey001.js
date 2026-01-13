const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');
const archiver = require('archiver');
const QueryStream = require('pg-query-stream');
const { Transform } = require('stream');

/**
 * @swagger
 * tags:
 *   name: ba_artkey001
 *   description: Articoli chiavi
 */

/**
 * @swagger
 * /ba_artkey001/export:
 *   get:
 *     summary: Esporta ba_artkey005 in ZIP come JSON (streaming)
 *     tags: [ba_artkey001]
 *     responses:
 *       200:
 *         description: File ZIP contenente JSON
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export', async (req, res) => {
  const client = await pool.connect();

  try {
    // Header per download ZIP
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="ba_artkey005.zip"'
    );

    // Crea l'archiver
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end();
      client.release();
    });

    archive.pipe(res);

    // Stream dal DB
    const query = new QueryStream('SELECT * FROM ba_artkey005');
    const dbStream = client.query(query);

    // Trasforma gli oggetti in JSON riga per riga
    let first = true;
    const jsonTransform = new Transform({
      writableObjectMode: true,
      transform: (chunk, encoding, callback) => {
        try {
          const jsonChunk = JSON.stringify(chunk);
          const output = first ? `[${jsonChunk}` : `,${jsonChunk}`;
          first = false;
          callback(null, output);
        } catch (err) {
          callback(err);
        }
      },
      final(callback) {
        callback(null, ']'); // chiude l'array JSON
      }
    });

    // Appendi lo stream JSON dentro lo ZIP
    archive.append(dbStream.pipe(jsonTransform), { name: 'ba_artkey005.json' });

    // Finalizza lo ZIP
    archive.finalize().then(() => client.release());
  } catch (err) {
    console.error(err);
    client.release();
    res.status(500).end();
  }
});

/**
 * @swagger
 * /ba_artkey001/preview:
 *   get:
 *     summary: Preview di ba_artkey005 
 *     tags: [ba_artkey001]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero della pagina
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Numero di righe per pagina
 *     responses:
 *       200:
 *         description: Lista JSON paginata
 */
router.get('/preview', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // Contiamo tutte le righe (solo una volta puoi cache se vuoi)
    const countResult = await pool.query('SELECT COUNT(*) FROM ba_artkey005');
    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    // Prendiamo solo i dati della pagina richiesta
    const { rows } = await pool.query(
      'SELECT * FROM ba_artkey005 ORDER BY kaflgart, kaidguid OFFSET $1 LIMIT $2',
      [offset, limit]
    );

    res.json({
      page,
      limit,
      totalRows,
      totalPages,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
