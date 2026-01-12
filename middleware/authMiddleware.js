const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Token mancante' });

  const token = authHeader.split(' ')[1]; // formato: Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'Token non valido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token non valido o scaduto' });

    req.user = decoded; // aggiunge info dell’utente alla request
    next();
  });
};

module.exports = verifyToken;
