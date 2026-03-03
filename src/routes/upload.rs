// handles Multipart extraction and HTTP response formatting
use axum::{extract::{Multipart, State}, response::IntoResponse};
use sqlx::SqlitePool;

use crate::services::file_services::handle_upload;

pub async fn upload(
    State(pool): State<SqlitePool>,
    mut multipart: Multipart,
) -> impl IntoResponse {

    match handle_upload(&pool, &mut multipart).await {
        Ok(link) => link,
        Err(e) => {
            eprintln!("Upload error: {}", e);
            "Upload failed".to_string()
        }
    }
}