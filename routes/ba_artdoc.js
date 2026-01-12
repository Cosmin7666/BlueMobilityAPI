const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_artdoc
 *   description: Immagini articoli
 */

/**
 * @swagger
 * /ba_artdoc:
 *   get:
 *     summary: Restituisce tutte le immagini articoli
 *     tags: [ba_artdoc]
 *     responses:
 *       200:
 *         description: Lista immagini
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_artdoc');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
