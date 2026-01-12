const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_cliforsed001
 *   description: Associazione sede-destinazione
 */

/**
 * @swagger
 * /ba_cliforsed001:
 *   get:
 *     summary: Restituisce tutte le associazioni sede-destinazione
 *     tags: [ba_cliforsed001]
 *     responses:
 *       200:
 *         description: Lista record
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_cliforsed005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
