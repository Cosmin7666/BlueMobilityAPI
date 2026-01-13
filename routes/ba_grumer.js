const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_grumer
 *   description: Gruppi merceologici
 */

/**
 * @swagger
 * /ba_grumer:
 *   get:
 *     summary: Restituisce tutti i gruppi merceologici
 *     tags: [ba_grumer]
 *     responses:
 *       200:
 *         description: Lista gruppi
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_grumer');
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
