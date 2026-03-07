// The repository layer is responsible only for database interactions, abstracts SQL queries away from the service layer.
use sqlx::{SqlitePool, Row};

// Struct representing metadata stored in the database
pub struct FileMetadata {
    pub filename: String,
    pub storage_path: String,
}

pub async fn insert_file_metadata(
    pool: &SqlitePool,
    id: &str,
    filename: &str,
    storage_path: &str,
    file_size: i64,
    created_at: i64,
) -> Result<(), sqlx::Error> {

    sqlx::query(
        r#"
        INSERT INTO files (id, filename, storage_path, file_size, created_at)
        VALUES (?, ?, ?, ?, ?)
        "#
    )
    .bind(id)
    .bind(filename)
    .bind(storage_path)
    .bind(file_size)
    .bind(created_at)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn get_file_metadata(
    pool: &SqlitePool,
    id: &str,

) -> Result<FileMetadata, sqlx::Error> {

    // SQL query to retrieve metadata
    let row = sqlx::query(
        r#"
        SELECT filename, storage_path
        FROM files
        WHERE id = ?
        "#
    ).bind(id) // Bind the file ID safely (prevents SQL injection)
    .fetch_one(pool) // Fetch exactly one row
    .await?;

    // Convert the row into a FileMetadata struct
    Ok(FileMetadata {
        filename: row.get("filename"),
        storage_path: row.get("storage_path"),
    })
}