const express = require('express');
const router = express.Router();
const pool = require('../db/mec42_svi');

/**
 * Crea un router GET generico per una tabella
 * @param {string} tableName - nome della tabella
 */
function createTableRouter(tableName) {
  /**
   * @swagger
   * tags:
   *   name: {tableName}
   *   description: Dati della tabella {tableName}
   */

  /**
   * @swagger
   * /{tableName}:
   *   get:
   *     summary: Restituisce tutti i record della tabella {tableName}
   *     tags: [{tableName}]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista completa
   *       500:
   *         description: Errore nel database
   */
  router.get(`/${tableName}`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${tableName}`);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Errore nel database' });
    }
  });

  return router;
}

module.exports = createTableRouter;
