// API Service for NovEng Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Module {
  id: string;
  module_number: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  rating: number;
  student_count: number;
  thumbnail_url: string;
  overview_content?: string;
  lesson_content?: string;
  module_tags?: Array<{ tag: string }>;
}

export const api = {
  /**
   * Fetch all modules
   * @param filters - Optional filters for category, difficulty, search
   */
  async getModules(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Module[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_BASE_URL}/modules${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.statusText}`);
    }

    const data = await response.json();
    return data.modules;
  },

  /**
   * Fetch single module by slug
   * @param slug - Module slug (e.g., 'blinking-an-led')
   */
  async getModule(slug: string): Promise<Module> {
    const response = await fetch(`${API_BASE_URL}/modules/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Module not found');
      }
      throw new Error(`Failed to fetch module: ${response.statusText}`);
    }

    const data = await response.json();
    return data.module;
  },

  /**
   * Fetch module content (overview and lesson markdown)
   * @param slug - Module slug
   */
  async getModuleContent(slug: string): Promise<{
    overview: string;
    lesson: string;
  }> {
    console.log(`🔍 [API] Fetching module content for slug: "${slug}"`);

    // Try backend API first
    try {
      const apiUrl = `${API_BASE_URL}/modules/${slug}/content`;
      console.log(`🔗 [API] Trying backend API: ${apiUrl}`);
      const response = await fetch(apiUrl);
      console.log(`📡 [API] Backend response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API] Successfully fetched from backend');
        return data.content;
      }
    } catch (error) {
      console.log('⚠️ [API] Backend unavailable, falling back to static files:', error);
    }

    // Fallback: fetch markdown files directly from curriculum folder
    try {
      const overviewUrl = `/curriculum/${slug}/overview.md`;
      const lessonUrl = `/curriculum/${slug}/lesson.md`;
      console.log(`📄 [API] Fetching static files:`);
      console.log(`   - Overview: ${overviewUrl}`);
      console.log(`   - Lesson: ${lessonUrl}`);

      const [overviewRes, lessonRes] = await Promise.all([
        fetch(overviewUrl),
        fetch(lessonUrl)
      ]);

      console.log(`📊 [API] Static file responses:`);
      console.log(`   - Overview: ${overviewRes.status} ${overviewRes.statusText}`);
      console.log(`   - Lesson: ${lessonRes.status} ${lessonRes.statusText}`);

      if (!overviewRes.ok || !lessonRes.ok) {
        throw new Error(`Failed to fetch curriculum files. Overview: ${overviewRes.status}, Lesson: ${lessonRes.status}`);
      }

      const overview = await overviewRes.text();
      const lesson = await lessonRes.text();

      console.log(`📝 [API] Content lengths:`);
      console.log(`   - Overview: ${overview.length} chars`);
      console.log(`   - Lesson: ${lesson.length} chars`);
      console.log('✅ [API] Successfully fetched from static files');

      return { overview, lesson };
    } catch (error) {
      console.error('❌ [API] Failed to fetch module content from both API and static files:', error);
      throw new Error(`Failed to fetch module content for ${slug}`);
    }
  },

  /**
   * Fetch module prerequisites
   * @param slug - Module slug
   */
  async getModulePrerequisites(slug: string): Promise<Module[]> {
    const response = await fetch(`${API_BASE_URL}/modules/${slug}/prerequisites`);
    if (!response.ok) {
      throw new Error(`Failed to fetch prerequisites: ${response.statusText}`);
    }

    const data = await response.json();
    return data.prerequisites;
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    return response.json();
  }
};

// Helper function to convert backend module format to frontend format
export function mapModuleToFrontend(backendModule: any) {
  return {
    id: backendModule.slug,
    title: backendModule.title,
    description: backendModule.description || '',
    category: backendModule.category,
    difficulty: backendModule.difficulty,
    duration: backendModule.duration,
    rating: backendModule.rating,
    studentCount: backendModule.student_count,
    progress: 0, // Will be fetched from user progress in Phase 2
    thumbnail: backendModule.thumbnail_url,
    steps: [], // Parse from lesson_content in Phase 2
    quiz: [] // Fetch from quiz_questions in Phase 2
  };
}
