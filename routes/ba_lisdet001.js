const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_lisdet001
 *   description: Listini dettagli
 */

/**
 * @swagger
 * /ba_lisdet001:
 *   get:
 *     summary: Restituisce tutti i dettagli dei listini
 *     tags: [ba_lisdet001]
 *     responses:
 *       200:
 *         description: Lista dettagli listini
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_lisdet005');
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
