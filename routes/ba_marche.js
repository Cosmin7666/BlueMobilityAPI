const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_marche
 *   description: Brand
 */

/**
 * @swagger
 * /ba_marche:
 *   get:
 *     summary: Restituisce tutti i brand
 *     tags: [ba_marche]
 *     responses:
 *       200:
 *         description: Lista brand
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_marche');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
