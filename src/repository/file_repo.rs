// The repository layer is responsible only for database interactions, abstracts SQL queries away from the service layer.
use sqlx::{SqlitePool, Row};

// Struct representing metadata stored in the database
pub struct FileMetadata {
    pub filename: String,
    pub storage_path: String,
    pub expires_at: Option<i64>,
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
        SELECT filename, storage_path, expires_at
        FROM files
        WHERE id = ?
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await?;
    // Convert the row into a FileMetadata struct
    Ok(FileMetadata {
        filename: row.get("filename"),
        storage_path: row.get("storage_path"),
        expires_at: row.get("expires_at"),
    })
}

pub async fn increment_download_count(
    pool: &SqlitePool,
    id: &str,
) -> Result<bool, sqlx::Error> {

    let result = sqlx::query(
        r#"
        UPDATE files
        SET download_count = download_count + 1
        WHERE id = ?
        AND (max_downloads IS NULL OR download_count < max_downloads)
        "#
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(result.rows_affected() > 0)
}