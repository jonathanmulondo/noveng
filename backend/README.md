# NovEng Backend API

Node.js/Express backend for the NovEng Arduino Learning Platform with PostgreSQL (Supabase) database.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key (for admin operations)

### 3. Set Up Database
```bash
# Run the schema SQL in your Supabase SQL editor
# File: src/scripts/schema.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Seed Curriculum Data
```bash
npm run seed
```

This will upload all 50 Arduino modules from the `curriculum/` folder into the database.

### 5. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Supabase client configuration
│   ├── controllers/             # Business logic (future)
│   ├── middleware/              # Auth, validation (future)
│   ├── models/                  # Data models (future)
│   ├── routes/
│   │   ├── modules.js           # Module endpoints
│   │   ├── auth.js              # Authentication (Phase 2)
│   │   ├── progress.js          # User progress (Phase 2)
│   │   └── feed.js              # Community feed (Phase 2)
│   ├── scripts/
│   │   ├── schema.sql           # Database schema
│   │   └── seedCurriculum.js    # Curriculum upload script
│   └── server.js                # Express app entry point
├── .env.example                 # Environment template
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Returns server status and environment info.

### Modules

#### Get All Modules
```
GET /api/modules
Query params:
  - category: Filter by category (Arduino, PCB Design, etc.)
  - difficulty: Filter by difficulty (Beginner, Intermediate, Advanced)
  - search: Search in title and description
```

**Response:**
```json
{
  "success": true,
  "count": 50,
  "modules": [
    {
      "id": "uuid",
      "module_number": 1,
      "slug": "introduction-to-arduino-and-ide",
      "title": "Introduction to Arduino & IDE",
      "description": "...",
      "category": "Arduino",
      "difficulty": "Beginner",
      "duration": "15 min",
      "rating": 4.9,
      "student_count": 15420,
      "thumbnail_url": "...",
      "module_tags": [...]
    }
  ]
}
```

#### Get Single Module
```
GET /api/modules/:slug
```

**Response:**
```json
{
  "success": true,
  "module": {
    "id": "uuid",
    "slug": "blinking-an-led",
    "title": "Blinking an LED",
    "overview_content": "# Blinking an LED\n\n...",
    "lesson_content": "# Lesson...",
    "quiz_questions": [...]
  }
}
```

#### Get Module Content
```
GET /api/modules/:slug/content
```

Returns markdown content for overview and lesson.

#### Get Module Prerequisites
```
GET /api/modules/:slug/prerequisites
```

Returns list of prerequisite modules.

### Authentication (Phase 2)
```
POST /api/auth/register   - Not yet implemented
POST /api/auth/login      - Not yet implemented
```

### Progress Tracking (Phase 2)
```
GET /api/progress/:userId - Not yet implemented
```

### Community Feed (Phase 2)
```
GET /api/feed             - Not yet implemented
```

---

## 🗄️ Database Schema

### Core Tables

**modules** - Arduino curriculum modules
- `id` (UUID, PK)
- `module_number` (Integer, unique)
- `slug` (String, unique)
- `title`, `description`
- `category`, `difficulty`, `duration`
- `rating`, `student_count`
- `thumbnail_url`
- `overview_content` (Text/Markdown)
- `lesson_content` (Text/Markdown)
- Timestamps

**module_tags** - Tags for filtering/search
- `id` (UUID, PK)
- `module_id` (FK → modules)
- `tag` (String)

**module_prerequisites** - Module dependencies
- `id` (UUID, PK)
- `module_id` (FK → modules)
- `prerequisite_module_id` (FK → modules)

**quiz_questions** - Module quizzes
- `id` (UUID, PK)
- `module_id` (FK → modules)
- `question`, `options` (JSONB), `correct_index`
- `explanation`

### User Tables (Phase 2)
- `users` - User accounts
- `user_stats` - XP, level, skills
- `user_progress` - Module completion tracking
- `user_quiz_attempts` - Quiz history
- `badges` - Achievements
- `user_badges` - Earned badges

### Community Tables (Phase 2)
- `posts` - Feed content
- `post_likes` - Post reactions
- `post_comments` - Discussions

---

## 📤 Seeding the Database

The `seedCurriculum.js` script:
1. Reads `curriculum/curriculum-data.json`
2. For each module, reads `overview.md` and `lesson.md`
3. Inserts/updates module data in database
4. Inserts tags
5. Creates prerequisite relationships

**Run seeding:**
```bash
npm run seed
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║     📚 NOVENG CURRICULUM DATABASE SEEDING                 ║
╚═══════════════════════════════════════════════════════════╝

📖 Loading 50 modules from curriculum...

✓ Inserted: Module 1 - Introduction to Arduino & IDE
✓ Inserted: Module 2 - Blinking an LED
...
✓ Inserted: Module 50 - Complete Capstone Project

╔═══════════════════════════════════════════════════════════╗
║     ✅ CURRICULUM SEEDING COMPLETE!                        ║
╠═══════════════════════════════════════════════════════════╣
║  Inserted:  50                                            ║
║  Updated:   0                                             ║
║  Errors:    0                                             ║
║  Total:     50                                            ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```
Uses `nodemon` for auto-reload on file changes.

### Run in Production Mode
```bash
npm start
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM/Client**: @supabase/supabase-js
- **Environment**: dotenv
- **CORS**: cors middleware

---

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT (Phase 2)
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## 🚀 Deployment

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Deploy to Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## 🔒 Security

- CORS configured for specific origins
- Environment variables for sensitive data
- Prepared for JWT authentication (Phase 2)
- SQL injection protected by Supabase client
- Input validation with express-validator (future)

---

## 🧪 Testing

(To be implemented in Phase 2)
- Unit tests with Jest
- Integration tests for API endpoints
- Database seeding tests

---

## 📚 Next Steps (Phase 2)

- [ ] Implement user authentication (JWT)
- [ ] Add user progress tracking
- [ ] Build community feed endpoints
- [ ] Implement quiz submission and scoring
- [ ] Add badge/achievement system
- [ ] Create admin dashboard endpoints
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Add API documentation (Swagger)

---

## 🐛 Troubleshooting

**Database connection fails**
- Check Supabase URL and keys in `.env`
- Verify database is accessible
- Check Supabase project status

**Seeding fails**
- Ensure `curriculum/` folder exists with all 50 modules
- Verify `curriculum-data.json` is valid JSON
- Check database permissions

**Module content not loading**
- Verify markdown files exist in `curriculum/[slug]/` folders
- Check file permissions

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/noveng/backend/issues
- Documentation: See main repo README

---

**Built with ❤️ for the NovEng Arduino Learning Platform**
