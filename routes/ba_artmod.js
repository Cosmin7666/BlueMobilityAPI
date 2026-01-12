const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_artmod
 *   description: Articoli modelli
 */

/**
 * @swagger
 * /ba_artmod:
 *   get:
 *     summary: Restituisce tutti gli articoli modelli
 *     tags: [ba_artmod]
 *     responses:
 *       200:
 *         description: Lista articoli
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_artmod');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
