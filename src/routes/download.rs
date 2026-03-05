use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use sqlx::SqlitePool;

use crate::services::download_service::handle_download;

pub async fn download(
    Path(file_id): Path<String>,
    State(pool): State<SqlitePool>,
) -> impl IntoResponse {

    match handle_download(&pool, &file_id).await {
        Ok(response) => response,
        Err(e) => {
            eprintln!("Download error: {}", e);
            (StatusCode::NOT_FOUND, "File not found").into_response()
        }
    }
}