CREATE TABLE files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    password_hash TEXT,
    expires_at INTEGER,
    max_downloads INTEGER,
    download_count INTEGER DEFAULT 0,
    file_size INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);