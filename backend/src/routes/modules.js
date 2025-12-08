import express from 'express';
import { supabase } from '../config/database.js';

const router = express.Router();

// GET /api/modules - Get all modules
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let query = supabase
      .from('modules')
      .select('*')
      .order('module_number', { ascending: true });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      modules: data
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules',
      message: error.message
    });
  }
});

// GET /api/modules/:slug - Get single module by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Module not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      module: data
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch module',
      message: error.message
    });
  }
});

// GET /api/modules/:slug/content - Get module lesson content
router.get('/:slug/content', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('modules')
      .select('lesson_content, overview_content')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Module not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      content: {
        lesson: data.lesson_content,
        overview: data.overview_content
      }
    });
  } catch (error) {
    console.error('Error fetching module content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch module content',
      message: error.message
    });
  }
});

// GET /api/modules/:slug/prerequisites - Get module prerequisites
router.get('/:slug/prerequisites', async (req, res) => {
  try {
    const { slug } = req.params;

    // First get the module ID
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('slug', slug)
      .single();

    if (moduleError) throw moduleError;

    // Get prerequisites
    const { data, error } = await supabase
      .from('module_prerequisites')
      .select(`
        prerequisite_module_id,
        modules:prerequisite_module_id (
          id, slug, title, module_number
        )
      `)
      .eq('module_id', module.id);

    if (error) throw error;

    res.json({
      success: true,
      prerequisites: data.map(p => p.modules)
    });
  } catch (error) {
    console.error('Error fetching prerequisites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prerequisites',
      message: error.message
    });
  }
});

export default router;
