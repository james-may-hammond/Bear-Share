use axum::extract::Multipart;
use sqlx::SqlitePool;
use uuid::Uuid;
use tokio::io::AsyncWriteExt;
use chrono::Utc;

use crate::repository::file_repo::insert_file_metadata;

pub async fn handle_upload(
    pool: &SqlitePool,
    multipart: &mut Multipart,
) -> Result<String, Box<dyn std::error::Error>> {

    while let Some(mut field) = multipart.next_field().await? {

        let filename = field.file_name().unwrap_or("file").to_string();
        let file_id = Uuid::new_v4().to_string();
        let storage_path = format!("storage/{}", file_id);
        
        let mut file = tokio::fs::File::create(&storage_path).await?;
        let mut file_size = 0;

        while let Some(chunk) = field.chunk().await? {
            file_size += chunk.len() as i64;
            file.write_all(&chunk).await?;
        }

        insert_file_metadata(
            pool,
            &file_id,
            &filename,
            &storage_path,
            file_size,
            Utc::now().timestamp(),
        ).await?;

        return Ok(format!("http://localhost:3000/f/{}", file_id));
    }

    Err("No file found in upload".into())
}