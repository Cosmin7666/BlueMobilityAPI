const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_offices
 *   description: Uffici
 */

/**
 * @swagger
 * /ba_offices:
 *   get:
 *     summary: Restituisce tutti gli uffici
 *     tags: [ba_offices]
 *     responses:
 *       200:
 *         description: Lista uffici
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_offices');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
