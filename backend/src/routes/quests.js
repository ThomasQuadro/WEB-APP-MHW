const { Router } = require('express');
const { fetchWithCache } = require('../services/mhwApi');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchWithCache('/quests');  // Note: l'endpoint exact dépend de mhw-db.com
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await fetchWithCache(`/quests/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
