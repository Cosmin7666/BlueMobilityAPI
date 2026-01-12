const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_mercat
 *   description: Categorie cliente
 */

/**
 * @swagger
 * /ba_mercat:
 *   get:
 *     summary: Restituisce tutte le categorie cliente
 *     tags: [ba_mercat]
 *     responses:
 *       200:
 *         description: Lista categorie
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_mercat');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
