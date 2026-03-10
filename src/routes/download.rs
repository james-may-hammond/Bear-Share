use axum::{
    extract::{Path, State},
    http::StatusCode, //HTTP Status code for responses
    response::IntoResponse,
};
use sqlx::SqlitePool;

use crate::services::download_service::handle_download;

// HTTP handler for the route: GET /f
pub async fn download(
    Path(file_id): Path<String>, 
    State(pool): State<SqlitePool>,
) -> impl IntoResponse {

    match handle_download(&pool, &file_id).await {
        Ok(response) => response,
        Err(e) => {
            eprintln!("Download error: {}", e);
            (StatusCode::GONE, "File expired or not found").into_response()
        }   
    }
}