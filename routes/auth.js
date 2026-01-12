const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/test_auth'); // DB test_auth per login

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
 *     summary: Effettua il login e restituisce il token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: Admin2026
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Username o password errati
 *       500:
 *         description: Errore server
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cerca l'utente nel DB
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    const user = result.rows[0];

    // Confronta la password in chiaro con l'hash memorizzato
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Username o password errati' });
    }

    // Genera il token JWT con id, username e ruolo
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
