const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');
const archiver = require('archiver');
const QueryStream = require('pg-query-stream');
const prettyJsonStream = require('../utils/prettyJsonStream');

/**
 * @swagger
 * tags:
 *   name: ba_artmod
 *   description: Articoli modelli
 */

/**
 * @swagger
 * /ba_artmod/preview:
 *   get:
 *     summary: Preview di ba_artmod
 *     description: |
 *       Restituisce una **anteprima paginata** dei record di ba_artmod.
 *       Utile per consultazione rapida senza esportare l’intero dataset.
 *     tags: [ba_artmod]
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

    const countResult = await pool.query('SELECT COUNT(*) FROM ba_artmod');
    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    const { rows } = await pool.query(
      'SELECT * FROM ba_artmod ORDER BY arflgart, arkeyart OFFSET $1 LIMIT $2',
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


/**
 * @swagger
 * /ba_artmod/export:
 *   get:
 *     summary: Esporta ba_artmod in ZIP (JSON formattato, streaming)
 *     description: |
 *       Questa API esporta **tutti i record della tabella ba_artmod**
 *       in un file **ZIP** contenente un **JSON leggibile e formattato**.
 *
 *       L’esportazione avviene in **streaming**, quindi è adatta anche
 *       a grandi volumi di dati senza impatto sulla memoria.
 *
 *       Cosa ottieni:
 *       • Un file `ba_artmod.zip`
 *       • All’interno trovi `ba_artmod.json`
 *
 *       Come usarla:
 *       1. Clicca **Authorize** e inserisci il token JWT oppure **Try it out**
 *       2. Premi **Execute**
 *       3. Scarica il file ZIP
 *       4. Estrai e apri il file JSON con un editor
 *          (consigliato: Notepad++)
 *
 *       Nota:
 *       Swagger non visualizza il contenuto del file ZIP.
 *       Il JSON è accessibile solo dopo l’estrazione.
 *
 *     tags: [ba_artmod]
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
      'attachment; filename="ba_artmod.zip"'
    );

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end();
      client.release();
    });

    archive.pipe(res);

    const query = new QueryStream('SELECT * FROM ba_artmod');
    const dbStream = client.query(query);

    archive.append(
      dbStream.pipe(prettyJsonStream()),
      { name: 'ba_artmod.json' }
    );

    archive.finalize().then(() => client.release());
  } catch (err) {
    console.error(err);
    client.release();
    res.status(500).end();
  }
});


module.exports = router;
