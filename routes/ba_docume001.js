const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');
const archiver = require('archiver');
const QueryStream = require('pg-query-stream');
const prettyJsonStream = require('../utils/prettyJsonStream'); 

/**
 * @swagger
 * tags:
 *   name: ba_docume001
 *   description: Documenti
 */

/**
 * @swagger
 * /ba_docume001/preview:
 *   get:
 *     summary: Preview di ba_docume005
 *     description: |
 *       Restituisce una **anteprima paginata** dei documenti.
 *       Utile per consultazione rapida senza esportare tutto il dataset.
 *     tags: [ba_docume001]
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

    const countResult = await pool.query('SELECT COUNT(*) FROM ba_docume005');
    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    const { rows } = await pool.query(
      'SELECT * FROM ba_docume005 ORDER BY doserial, cprownum OFFSET $1 LIMIT $2',
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
 * /ba_docume001/export:
 *   get:
 *     summary: Esporta ba_docume005 in ZIP (JSON formattato, streaming)
 *     description: |
 *       Questa API esporta **tutti i record della tabella ba_docume005**
 *       in un file **ZIP** contenente un **JSON leggibile e formattato**.
 *
 *       L’esportazione avviene in **streaming**, quindi funziona anche
 *       con grandi volumi di dati senza impatto sulla memoria.
 *
 *       Cosa ottieni:
 *       • Un file `ba_docume005.zip`
 *       • All’interno trovi `ba_docume005.json`
 *
 *       Come usarla:
 *       1. Clicca **Authorize** e inserisci il token JWT oppure **Try it out**
 *       2. Premi **Execute**
 *       3. Scarica il file ZIP
 *       4. Estrai e apri il file JSON con un editor (consigliato: Notepad++)
 *
 *       Nota:
 *       Swagger non mostra il contenuto del file ZIP. Il JSON è accessibile solo dopo estrazione.
 *
 *     tags: [ba_docume001]
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
      'attachment; filename="ba_docume005.zip"'
    );

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end();
      client.release();
    });

    archive.pipe(res);

    const query = new QueryStream('SELECT * FROM ba_docume005');
    const dbStream = client.query(query);

    // ✅ usa il modulo prettyJsonStream
    archive.append(dbStream.pipe(prettyJsonStream()), {
      name: 'ba_docume005.json'
    });

    archive.finalize().then(() => client.release());
  } catch (err) {
    console.error(err);
    client.release();
    res.status(500).end();
  }
});


/**
 * @swagger
 * /ba_docume001/byDate:
 *   get:
 *     summary: Restituisce documenti filtrati per intervallo date (dodatreg)
 *     description: |
 *       Filtra i documenti tra `from` e `to` usando il campo `dodatreg` presente in `ba_docume_m005`.
 *       Esempio: `/ba_docume001/byDate?from=2025-01-01&to=2025-01-31&page=1&limit=50`
 *     tags: [ba_docume001]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data di inizio (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data di fine (YYYY-MM-DD)
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
 *         description: Lista JSON paginata dei documenti filtrati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalRows:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/byDate', async (req, res) => {
  try {
    const { from, to } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    if (!from || !to) {
      return res.status(400).json({ message: "Devi fornire 'from' e 'to' come YYYY-MM-DD" });
    }

    // Conta totale righe filtrate usando join se vuoi unire ba_docume005 con ba_docume_m005
    const countQuery = `
      SELECT COUNT(*)
      FROM ba_docume005 d
      LEFT JOIN ba_docume_m005 m ON d.doserial = m.doserial
      WHERE m.dodatreg BETWEEN $1 AND $2
    `;
    const countResult = await pool.query(countQuery, [from, to]);
    const totalRows = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalRows / limit);

    // Recupera tutti i campi da ba_docume005 filtrando sulla data in ba_docume_m005
    const dataQuery = `
      SELECT d.*
      FROM ba_docume005 d
      LEFT JOIN ba_docume_m005 m ON d.doserial = m.doserial
      WHERE m.dodatreg BETWEEN $1 AND $2
      ORDER BY m.dodatreg, d.doserial
      OFFSET $3 LIMIT $4
    `;
    const { rows } = await pool.query(dataQuery, [from, to, offset, limit]);

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
 * /ba_docume001/exportByDate:
 *   get:
 *     summary: Esporta documenti in ZIP filtrati per data (dodatreg)
 *     description: |
 *       Questo endpoint esporta i record della tabella ba_docume005 in un file ZIP,
 *       contenente un JSON formattato, filtrando tra `from` e `to` (YYYY-MM-DD)
 *       sul campo `dodatreg` di ba_docume_m005.
 *
 *       Esempio: `/ba_docume001/exportByDate?from=2025-01-01&to=2025-01-31`
 *
 *     tags: [ba_docume001]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data di inizio (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data di fine (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: File ZIP contenente JSON formattato
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/exportByDate', async (req, res) => {
  const client = await pool.connect();
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Devi fornire 'from' e 'to' come YYYY-MM-DD" });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ba_docume005_${from}_to_${to}.zip"`
    );

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      res.status(500).end();
      client.release();
    });
    archive.pipe(res);

    const query = new QueryStream(`
      SELECT d.*
      FROM ba_docume005 d
      LEFT JOIN ba_docume_m005 m ON d.doserial = m.doserial
      WHERE m.dodatreg BETWEEN $1 AND $2
      ORDER BY m.dodatreg, d.doserial
    `, [from, to]);

    const dbStream = client.query(query);

    // Usa prettyJsonStream per generare JSON leggibile dentro lo ZIP
    archive.append(dbStream.pipe(prettyJsonStream()), {
      name: `ba_docume005_${from}_to_${to}.json`
    });

    archive.finalize().then(() => client.release());
  } catch (err) {
    console.error(err);
    client.release();
    res.status(500).end();
  }
});


module.exports = router;
