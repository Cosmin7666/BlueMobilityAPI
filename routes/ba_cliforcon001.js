const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_cliforcon001
 *   description: Anagrafica clienti contatti
 */

/**
 * @swagger
 * /ba_cliforcon001:
 *   get:
 *     summary: Restituisce tutti i contatti clienti
 *     tags: [ba_cliforcon001]
 *     responses:
 *       200:
 *         description: Lista contatti
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_cliforcon005');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel database' });
  }
});

module.exports = router;
