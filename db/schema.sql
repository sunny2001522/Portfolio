CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  video TEXT,
  category TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_links_project_id ON project_links(project_id);

CREATE TABLE IF NOT EXISTS project_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);

CREATE TABLE IF NOT EXISTS messages (
  locale TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS film_credits (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  format_zh TEXT NOT NULL DEFAULT '',
  format_en TEXT NOT NULL DEFAULT '',
  role_zh TEXT NOT NULL,
  role_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS awards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  credit_id TEXT REFERENCES film_credits(id) ON DELETE CASCADE,
  year TEXT NOT NULL DEFAULT '',
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  result_zh TEXT NOT NULL DEFAULT '',
  result_en TEXT NOT NULL DEFAULT '',
  work_zh TEXT NOT NULL DEFAULT '',
  work_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_awards_page ON awards(page);
CREATE INDEX IF NOT EXISTS idx_awards_credit_id ON awards(credit_id);

CREATE TABLE IF NOT EXISTS role_profiles (
  role TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  me TEXT NOT NULL,
  about_skill TEXT NOT NULL,
  about_hobby TEXT NOT NULL,
  about_description TEXT NOT NULL,
  resume TEXT NOT NULL,
  PRIMARY KEY (role, locale)
);

CREATE TABLE IF NOT EXISTS role_taglines (
  role TEXT NOT NULL,
  locale TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  PRIMARY KEY (role, locale, sort_order)
);

CREATE TABLE IF NOT EXISTS project_i18n (
  project_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  user_text TEXT,
  PRIMARY KEY (project_id, locale)
);

CREATE TABLE IF NOT EXISTS project_outcomes (
  project_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  role TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  PRIMARY KEY (project_id, locale, role, sort_order)
);

CREATE TABLE IF NOT EXISTS skills (
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  category_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (category, name)
);
