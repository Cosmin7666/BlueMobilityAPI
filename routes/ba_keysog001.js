const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_keysog001
 *   description: Agenti
 */

/**
 * @swagger
 * /ba_keysog001:
 *   get:
 *     summary: Restituisce tutti gli agenti
 *     tags: [ba_keysog001]
 *     responses:
 *       200:
 *         description: Lista agenti
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_keysog005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
