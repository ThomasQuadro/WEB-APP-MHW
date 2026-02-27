const { Router } = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth');

const router = Router();

// ── Weapons progress ──

router.get('/weapons', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_weapons')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/weapons/:weaponId', requireAuth, async (req, res) => {
  try {
    const { is_crafted } = req.body;
    const { data, error } = await supabase
      .from('user_weapons')
      .upsert(
        {
          user_id: req.user.id,
          weapon_id: parseInt(req.params.weaponId),
          is_crafted: !!is_crafted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,weapon_id' }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Armor progress ──

router.get('/armor', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_armors')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/armor/:armorId', requireAuth, async (req, res) => {
  try {
    const { is_crafted } = req.body;
    const { data, error } = await supabase
      .from('user_armors')
      .upsert(
        {
          user_id: req.user.id,
          armor_id: parseInt(req.params.armorId),
          is_crafted: !!is_crafted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,armor_id' }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Quests progress ──

router.get('/quests', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/quests/:questId', requireAuth, async (req, res) => {
  try {
    const { is_completed } = req.body;
    const { data, error } = await supabase
      .from('user_quests')
      .upsert(
        {
          user_id: req.user.id,
          quest_id: parseInt(req.params.questId),
          is_completed: !!is_completed,
          completion_date: is_completed ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id,quest_id' }
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
