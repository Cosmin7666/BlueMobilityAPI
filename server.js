require('dotenv').config();

const express = require('express');
const cors = require('cors');

const verifyToken = require('./middleware/authMiddleware');
const setupSwagger = require('./swagger');

// -------------------- IMPORT ROUTE --------------------
const authRoutes = require('./routes/auth');

const ba_keysog001 = require('./routes/ba_keysog001');
const ba_cliforsed001 = require('./routes/ba_cliforsed001');
const ba_offices = require('./routes/ba_offices');
const ba_cliforcon001 = require('./routes/ba_cliforcon001');
const ba_cliforfid001 = require('./routes/ba_cliforfid001');
const ba_artmod = require('./routes/ba_artmod');
const ba_artattvar001 = require('./routes/ba_artattvar001');
const ba_artkey001 = require('./routes/ba_artkey001');
const ba_umiart001 = require('./routes/ba_umiart001');
const ba_lisdet001 = require('./routes/ba_lisdet001');
const ba_unimis = require('./routes/ba_unimis');
const ba_grumer = require('./routes/ba_grumer');
const ba_famarti = require('./routes/ba_famarti');
const ba_marche = require('./routes/ba_marche');
const ba_mercat = require('./routes/ba_mercat');
const ba_salart001 = require('./routes/ba_salart001');
const ba_artdoc = require('./routes/ba_artdoc');
const dm_vfiles = require('./routes/dm_vfiles');
const ba_payment = require('./routes/ba_payment');
const ba_docume_m001 = require('./routes/ba_docume_m001');
const ba_docume001 = require('./routes/ba_docume001');
const ba_codiva = require('./routes/ba_codiva');

// -------------------- INIT APP --------------------
const app = express();

// -------------------- CORS --------------------
app.use(cors({
  origin: '*', // permette richieste da qualsiasi PC
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));

// -------------------- BODY PARSER --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- SWAGGER --------------------
setupSwagger(app);

// -------------------- ROUTE --------------------
// Auth (pubbliche)
app.use('/api/v1/auth', authRoutes);

// Route protette da JWT
const protectedRoutes = {
  '/ba_keysog001': ba_keysog001,
  '/ba_cliforsed001': ba_cliforsed001,
  '/ba_offices': ba_offices,
  '/ba_cliforcon001': ba_cliforcon001,
  '/ba_cliforfid001': ba_cliforfid001,
  '/ba_artmod': ba_artmod,
  '/ba_artattvar001': ba_artattvar001,
  '/ba_artkey001': ba_artkey001,
  '/ba_umiart001': ba_umiart001,
  '/ba_lisdet001': ba_lisdet001,
  '/ba_unimis': ba_unimis,
  '/ba_grumer': ba_grumer,
  '/ba_famarti': ba_famarti,
  '/ba_marche': ba_marche,
  '/ba_mercat': ba_mercat,
  '/ba_salart001': ba_salart001,
  '/ba_artdoc': ba_artdoc,
  '/dm_vfiles': dm_vfiles,
  '/ba_payment': ba_payment,
  '/ba_docume_m001': ba_docume_m001,
  '/ba_docume001': ba_docume001,
  '/ba_codiva': ba_codiva
};

for (const path in protectedRoutes) {
  app.use(`/api/v1${path}`, verifyToken, protectedRoutes[path]);
}

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  });
