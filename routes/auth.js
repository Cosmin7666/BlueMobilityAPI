const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/test_auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticazione utenti
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login utente
 *     description: >
 *       Effettua l’autenticazione e restituisce un token JWT.
 *       Il token deve essere utilizzato nell’header Authorization
 *       per l’accesso agli endpoint protetti.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Credenziali di accesso
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user_example
 *               password:
 *                 type: string
 *                 example: password_example
 *     responses:
 *       200:
 *         description: Autenticazione riuscita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore interno del server
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Errore login:', err);
    res.status(500).json({ message: 'Errore nel login' });
  }
});

module.exports = router;

