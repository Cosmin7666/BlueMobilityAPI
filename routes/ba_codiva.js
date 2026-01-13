const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_codiva
 *   description: Codici IVA
 */

/**
 * @swagger
 * /ba_codiva:
 *   get:
 *     summary: Restituisce tutti i codici IVA
 *     tags: [ba_codiva]
 *     responses:
 *       200:
 *         description: Lista codici IVA
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_codiva');
    res.json({
      totalRows: result.rowCount, // numero totale righe restituite
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
