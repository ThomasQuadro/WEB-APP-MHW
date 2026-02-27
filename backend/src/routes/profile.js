const { Router } = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = Router();

// Get current user's profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mhw_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update profile
router.put('/', requireAuth, async (req, res) => {
  try {
    const { pseudo_ingame, platform } = req.body;

    if (platform && !['PC', 'PS', 'Xbox'].includes(platform)) {
      return res.status(400).json({ error: 'Plateforme invalide (PC, PS, Xbox)' });
    }

    const { data, error } = await supabase
      .from('mhw_profiles')
      .upsert(
        { user_id: req.user.id, pseudo_ingame, platform },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
