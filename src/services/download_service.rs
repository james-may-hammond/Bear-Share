use axum::{body::Body, http::{Response, StatusCode, header},};  // Types needed to construct HTTP responses
use sqlx::SqlitePool;
use tokio_util::io::ReaderStream; // converts a file into an async stream
use chrono::Utc;

use crate::repository::file_repo::{get_file_metadata, increment_download_count};

// download logic
pub async fn handle_download (
    pool: &SqlitePool,
    file_id: &str
) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let file = get_file_metadata(pool, file_id).await?;
    
    let allowed = increment_download_count(pool, file_id).await?;

    if let Some(expiry) = file.expires_at {
        if Utc::now().timestamp() > expiry {
            return Err("File Expired".into());
            
        }
    }
    

    if !allowed {
        return Err("Download limit reached".into());
    }

    let file_handle = tokio::fs::File::open(&file.storage_path).await?; // Open the file from disk using the stored path

    let stream = ReaderStream::new(file_handle); // Convert the file into a streaming reader, so that the file is sent chunk by chunk

    let body = Body::from_stream(stream);
		
    let response = Response::builder() // Build the HTTP response
        .status(StatusCode::OK)
        .header(
            header::CONTENT_DISPOSITION,
            format!("attachment; filename=\"{}\"", file.filename),
        )
        .header(header::CONTENT_TYPE, "application/octet-stream") // Generic binary file content type
        .body(body)?;
        
    Ok(response)
}