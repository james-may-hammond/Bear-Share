use axum::{body::Body, http::{Response, StatusCode, header},};
use sqlx::SqlitePool;
use tokio_util::io::ReaderStream;

use crate::repository::file_repo::get_file_metadata;

pub async fn handle_download (
    pool: &SqlitePool,
    file_id: &str
) -> Result<Response<Body>, Box<dyn std::error::Error>> {
    let file = get_file_metadata(pool, file_id).await?;
    
    let file_handle = tokio::fs::File::open(&file.storage_path).await?;

    let stream = ReaderStream::new(file_handle);

    let body = Body::from_stream(stream);

    let response = Response::builder()
        .status(StatusCode::OK)
        .header(
            header::CONTENT_DISPOSITION,
            format!("attachment; filename=\"{}\"", file.filename),
        )
        .header(header::CONTENT_TYPE, "application/octet-stream")
        .body(body)?;

    Ok(response)
}