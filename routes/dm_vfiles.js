const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');
const archiver = require('archiver');
const QueryStream = require('pg-query-stream');
const prettyJsonStream = require('../utils/prettyJsonStream'); 
/**
 * @swagger
 * tags:
 *   name: dm_vfiles
 *   description: File allegati
 */

/**
 * @swagger
 * /dm_vfiles/preview:
 *   get:
 *     summary: Preview di dm_vfiles
 *     description: |
 *       Restituisce una **anteprima paginata** dei file allegati.
 *       Utile per consultazione rapida senza esportare tutto il dataset.
 *     tags: [dm_vfiles]
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

    const countResult = await pool.query('SELECT COUNT(*) FROM dm_vfiles');
    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    const { rows } = await pool.query(
      'SELECT * FROM dm_vfiles ORDER BY vfcodiceid, vfparent LIMIT $1 OFFSET $2',
      [limit, offset]
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

/**
 * @swagger
 * /dm_vfiles/export:
 *   get:
 *     summary: Esporta dm_vfiles in ZIP (JSON formattato, streaming)
 *     description: |
 *       Questa API esporta **tutti i record della tabella dm_vfiles**
 *       in un file **ZIP** contenente un **JSON leggibile e formattato**.
 *
 *       L’esportazione avviene in **streaming**, quindi funziona anche
 *       con grandi volumi di dati senza impatto sulla memoria.
 *
 *       Cosa ottieni:
 *       • Un file `dm_vfiles.zip`
 *       • All’interno trovi `dm_vfiles.json`
 *
 *       Nota:
 *       Swagger non mostra il contenuto del file ZIP. Il JSON è accessibile solo dopo estrazione.
 *
 *     tags: [dm_vfiles]
 *     responses:
 *       200:
 *         description: File ZIP contenente JSON formattato
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export', async (req, res) => {
  const client = await pool.connect();

  try {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="dm_vfiles.zip"'
    );

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end();
      client.release();
    });

    archive.pipe(res);

    const query = new QueryStream('SELECT * FROM dm_vfiles');
    const dbStream = client.query(query);

    // ✅ usa prettyJsonStream per JSON leggibile
    archive.append(dbStream.pipe(prettyJsonStream()), { name: 'dm_vfiles.json' });

    archive.finalize().then(() => client.release());
  } catch (err) {
    console.error(err);
    client.release();
    res.status(500).end();
  }
});



module.exports = router;
