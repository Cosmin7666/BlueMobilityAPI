const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_famarti
 *   description: Famiglie articoli
 */

/**
 * @swagger
 * /ba_famarti:
 *   get:
 *     summary: Restituisce tutte le famiglie articoli
 *     tags: [ba_famarti]
 *     responses:
 *       200:
 *         description: Lista famiglie
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_famarti');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
