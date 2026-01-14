require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // ✅ necessario per express.static

const verifyToken = require('./middleware/authMiddleware');
const setupSwagger = require('./swagger'); // swagger.js nel root


// -------------------- IMPORT ROUTE --------------------
const authRoutes = require('./routes/auth'); // login

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
app.use(cors());
app.use(bodyParser.json());

// -------------------- SWAGGER --------------------
setupSwagger(app);

// -------------------- ROUTE --------------------
// Auth (pubbliche)
app.use('/api/v1/auth', authRoutes);

// Tutte le route protette da JWT
app.use('/api/v1/ba_keysog001', verifyToken, ba_keysog001);
app.use('/api/v1/ba_cliforsed001', verifyToken, ba_cliforsed001);
app.use('/api/v1/ba_offices', verifyToken, ba_offices);
app.use('/api/v1/ba_cliforcon001', verifyToken, ba_cliforcon001);
app.use('/api/v1/ba_cliforfid001', verifyToken, ba_cliforfid001);
app.use('/api/v1/ba_artmod', verifyToken, ba_artmod);
app.use('/api/v1/ba_artattvar001', verifyToken, ba_artattvar001);
app.use('/api/v1/ba_artkey001', verifyToken, ba_artkey001);
app.use('/api/v1/ba_umiart001', verifyToken, ba_umiart001);
app.use('/api/v1/ba_lisdet001', verifyToken, ba_lisdet001);
app.use('/api/v1/ba_unimis', verifyToken, ba_unimis);
app.use('/api/v1/ba_grumer', verifyToken, ba_grumer);
app.use('/api/v1/ba_famarti', verifyToken, ba_famarti);
app.use('/api/v1/ba_marche', verifyToken, ba_marche);
app.use('/api/v1/ba_mercat', verifyToken, ba_mercat);
app.use('/api/v1/ba_salart001', verifyToken, ba_salart001);
app.use('/api/v1/ba_artdoc', verifyToken, ba_artdoc);
app.use('/api/v1/dm_vfiles', verifyToken, dm_vfiles);
app.use('/api/v1/ba_payment', verifyToken, ba_payment);
app.use('/api/v1/ba_docume_m001', verifyToken, ba_docume_m001);
app.use('/api/v1/ba_docume001', verifyToken, ba_docume001);
app.use('/api/v1/ba_codiva', verifyToken, ba_codiva);



// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
