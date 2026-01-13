const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_unimis
 *   description: Unità di misura
 */

/**
 * @swagger
 * /ba_unimis:
 *   get:
 *     summary: Restituisce tutte le unità di misura
 *     tags: [ba_unimis]
 *     responses:
 *       200:
 *         description: Lista unità di misura
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_unimis');
    res.json({
      totalRows: result.rowCount, // numero totale righe restituite
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
