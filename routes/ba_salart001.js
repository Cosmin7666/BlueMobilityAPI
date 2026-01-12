const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_salart001
 *   description: Giacenza
 */

/**
 * @swagger
 * /ba_salart001:
 *   get:
 *     summary: Restituisce tutte le giacenze articoli
 *     tags: [ba_salart001]
 *     responses:
 *       200:
 *         description: Lista giacenze
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_salart005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
