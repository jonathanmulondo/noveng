import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Use service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Load curriculum data
const curriculumPath = join(__dirname, '../../../curriculum/curriculum-data.json');
const curriculumData = JSON.parse(readFileSync(curriculumPath, 'utf-8'));

// Helper function to read markdown files
function readMarkdownFile(slug, filename) {
  try {
    const filePath = join(__dirname, `../../../curriculum/${slug}/${filename}`);
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`⚠️  Could not read ${filename} for ${slug}:`, error.message);
    return '';
  }
}

// Helper function to extract prerequisites from title
function getPrerequisiteNames(prerequisites) {
  return prerequisites.filter(p => p !== 'Introduction to Arduino & IDE' && p !== 'Previous modules' && p !== 'All previous beginner modules' && p !== 'All previous modules');
}

async function seedModules() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     📚 NOVENG CURRICULUM DATABASE SEEDING                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  const modules = curriculumData.curriculum.modules;
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  console.log(`📖 Loading ${modules.length} modules from curriculum...`);
  console.log('');

  for (const moduleData of modules) {
    try {
      // Read markdown content
      const overviewContent = readMarkdownFile(moduleData.slug, 'overview.md');
      const lessonContent = readMarkdownFile(moduleData.slug, 'lesson.md');

      // Prepare module data for insertion
      const moduleToInsert = {
        module_number: moduleData.id,
        slug: moduleData.slug,
        title: moduleData.title,
        description: `Learn ${moduleData.title.toLowerCase()} with hands-on Arduino projects.`,
        category: moduleData.category,
        difficulty: moduleData.difficulty,
        duration: moduleData.duration,
        rating: moduleData.rating,
        student_count: moduleData.studentCount,
        thumbnail_url: moduleData.thumbnail || `/thumbnails/${moduleData.slug}.jpg`,
        overview_content: overviewContent,
        lesson_content: lessonContent
      };

      // Check if module already exists
      const { data: existing } = await supabase
        .from('modules')
        .select('id')
        .eq('slug', moduleData.slug)
        .single();

      if (existing) {
        // Update existing module
        const { error: updateError } = await supabase
          .from('modules')
          .update(moduleToInsert)
          .eq('slug', moduleData.slug);

        if (updateError) throw updateError;

        console.log(`✓ Updated: Module ${moduleData.id} - ${moduleData.title}`);
        skippedCount++;
      } else {
        // Insert new module
        const { data: insertedModule, error: insertError } = await supabase
          .from('modules')
          .insert([moduleToInsert])
          .select()
          .single();

        if (insertError) throw insertError;

        // Insert tags
        if (moduleData.tags && moduleData.tags.length > 0) {
          const tagsToInsert = moduleData.tags.map(tag => ({
            module_id: insertedModule.id,
            tag
          }));

          const { error: tagsError } = await supabase
            .from('module_tags')
            .insert(tagsToInsert);

          if (tagsError) {
            console.warn(`⚠️  Failed to insert tags for ${moduleData.title}`);
          }
        }

        console.log(`✓ Inserted: Module ${moduleData.id} - ${moduleData.title}`);
        insertedCount++;
      }

    } catch (error) {
      console.error(`✗ Error processing module ${moduleData.id}:`, error.message);
      errorCount++;
    }
  }

  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('Processing module prerequisites...');
  console.log('');

  // Second pass: Add prerequisites
  for (const moduleData of modules) {
    try {
      if (!moduleData.prerequisites || moduleData.prerequisites.length === 0) {
        continue;
      }

      // Get module ID
      const { data: module } = await supabase
        .from('modules')
        .select('id')
        .eq('slug', moduleData.slug)
        .single();

      if (!module) continue;

      // Get prerequisite module IDs by matching titles
      const prereqNames = getPrerequisiteNames(moduleData.prerequisites);

      for (const prereqName of prereqNames) {
        // Find prerequisite module by title (fuzzy match)
        const { data: prereqModules } = await supabase
          .from('modules')
          .select('id')
          .ilike('title', `%${prereqName}%`);

        if (prereqModules && prereqModules.length > 0) {
          const prereqModule = prereqModules[0];

          // Insert prerequisite relationship (ignore duplicates)
          await supabase
            .from('module_prerequisites')
            .insert({
              module_id: module.id,
              prerequisite_module_id: prereqModule.id
            })
            .select();
        }
      }

    } catch (error) {
      // Ignore duplicate key errors
      if (!error.message.includes('duplicate')) {
        console.warn(`⚠️  Error adding prerequisites for ${moduleData.title}`);
      }
    }
  }

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     ✅ CURRICULUM SEEDING COMPLETE!                        ║');
  console.log('║                                                           ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║  Inserted:  ${insertedCount.toString().padEnd(45)} ║`);
  console.log(`║  Updated:   ${skippedCount.toString().padEnd(45)} ║`);
  console.log(`║  Errors:    ${errorCount.toString().padEnd(45)} ║`);
  console.log(`║  Total:     ${modules.length.toString().padEnd(45)} ║`);
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  process.exit(0);
}

// Run seeding
seedModules().catch(error => {
  console.error('');
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║                                                           ║');
  console.error('║     ✗ SEEDING FAILED!                                     ║');
  console.error('║                                                           ║');
  console.error('╚═══════════════════════════════════════════════════════════╝');
  console.error('');
  console.error('Error details:', error);
  console.error('');
  process.exit(1);
});
