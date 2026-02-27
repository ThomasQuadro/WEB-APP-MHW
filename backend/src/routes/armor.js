const { Router } = require('express');
const { fetchWithCache } = require('../services/mhwApi');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchWithCache('/armor');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await fetchWithCache(`/armor/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
