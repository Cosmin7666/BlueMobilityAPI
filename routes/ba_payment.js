const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * @swagger
 * tags:
 *   name: ba_payment
 *   description: Tipi di pagamento
 */

/**
 * @swagger
 * /ba_payment:
 *   get:
 *     summary: Restituisce tutti i tipi di pagamento
 *     tags: [ba_payment]
 *     responses:
 *       200:
 *         description: Lista tipi pagamento
 *       500:
 *         description: Errore nel database
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ba_payment');
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
