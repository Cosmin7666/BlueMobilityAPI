const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: dm_vfiles
 *   description: File allegati
 */

/**
 * @swagger
 * /dm_vfiles:
 *   get:
 *     summary: Restituisce tutti i file allegati
 *     tags: [dm_vfiles]
 *     responses:
 *       200:
 *         description: Lista file
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dm_vfiles');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
