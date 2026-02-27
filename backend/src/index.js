require('dotenv').config();
const express = require('express');
const cors = require('cors');

const monstersRouter = require('./routes/monsters');
const weaponsRouter = require('./routes/weapons');
const armorRouter = require('./routes/armor');
const questsRouter = require('./routes/quests');
const profileRouter = require('./routes/profile');
const progressRouter = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// MHW data routes (public)
app.use('/api/monsters', monstersRouter);
app.use('/api/weapons', weaponsRouter);
app.use('/api/armor', armorRouter);
app.use('/api/quests', questsRouter);

// User routes (authenticated)
app.use('/api/profile', profileRouter);
app.use('/api/progress', progressRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
