const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_docume_m001
 *   description: Storico ordini master
 */

/**
 * @swagger
 * /ba_docume_m001:
 *   get:
 *     summary: Restituisce lo storico ordini master
 *     tags: [ba_docume_m001]
 *     responses:
 *       200:
 *         description: Lista ordini master
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_docume_m005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
