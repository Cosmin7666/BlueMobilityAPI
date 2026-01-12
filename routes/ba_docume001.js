const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi'); // il pool Postgres
const { Parser } = require('json2csv'); // per trasformare JSON in CSV

// Cache in memoria per le pagine
const cache = new Map();
const PREFETCH_PAGES = 1; // numero di pagine da prefetchare avanti

/**
 * @swagger
 * /ba_docume001:
 *   get:
 *     summary: Ottieni documenti con paginazione
 *     description: Restituisce i documenti in pagine con totale righe e pagine
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
 *           default: 1000
 *         description: Numero di righe per pagina
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Formato di ritorno
 *     responses:
 *       200:
 *         description: Lista dei documenti paginata
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const format = req.query.format || 'json';

    // Contiamo tutte le righe solo la prima volta (cache semplice)
    let totalRows = cache.get('totalRows');
    if (totalRows === undefined) {
      const countResult = await pool.query('SELECT COUNT(*) FROM ba_docume005');
      totalRows = parseInt(countResult.rows[0].count, 10);
      cache.set('totalRows', totalRows);
    }
    const totalPages = Math.ceil(totalRows / limit);

    // Funzione interna per prendere la pagina (dalla cache se possibile)
    async function getPageData(p) {
      if (cache.has(p)) return cache.get(p);

      const offset = (p - 1) * limit;
      const { rows } = await pool.query(
        'SELECT * FROM ba_docume005 ORDER BY doserial, cprownum OFFSET $1 LIMIT $2',
        [offset, limit]
      );

      cache.set(p, rows);
      return rows;
    }

    // Carica la pagina richiesta
    const data = await getPageData(page);

    // Prefetch pagine successive in background
    for (let i = 1; i <= PREFETCH_PAGES; i++) {
      const nextPage = page + i;
      if (nextPage <= totalPages) getPageData(nextPage); // async senza await
    }

    if (format === 'csv') {
      // Trasforma in CSV e invia come testo
      const json2csv = new Parser();
      const csv = json2csv.parse(data);
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    } else {
      // Formato JSON standard
      res.json({
        page,
        limit,
        totalRows,
        totalPages,
        data
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
