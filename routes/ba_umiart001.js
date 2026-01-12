const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_umiart001
 *   description: Unità di misura articoli
 */

/**
 * @swagger
 * /ba_umiart001:
 *   get:
 *     summary: Restituisce tutte le unità di misura degli articoli
 *     tags: [ba_umiart001]
 *     responses:
 *       200:
 *         description: Lista unità di misura
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_umiart005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
