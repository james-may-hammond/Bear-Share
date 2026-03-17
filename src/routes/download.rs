use axum::{
    extract::{Path, State,Query},
    http::StatusCode, //HTTP Status code for responses
    response::IntoResponse,
};
use serde::Deserialize;
use sqlx::SqlitePool;

use crate::services::download_service::handle_download;

#[derive(Deserialize)]
pub struct DownloadParams {
    password: Option<String>,
}

// HTTP handler for the route: GET /f
pub async fn download(
    Path(file_id): Path<String>, 
    Query(params): Query<DownloadParams>,
    State(pool): State<SqlitePool>,
) -> impl IntoResponse {

    match handle_download(&pool, &file_id, params.password).await {
        Ok(response) => response,
        Err(e) => {
            let error_msg = e.to_string();
            eprintln!("Download error: {}", error_msg);
            if error_msg == "Password required" || error_msg == "Incorrect password" || error_msg == "Invalid password hash" {
                (StatusCode::UNAUTHORIZED, "Password required or incorrect").into_response()
            } else if error_msg == "File Expired" {
                (StatusCode::GONE, "File expired").into_response()
            } else if error_msg == "Download limit reached" {
                (StatusCode::TOO_MANY_REQUESTS, "Download limit reached").into_response()
            } else {
                (StatusCode::NOT_FOUND, "File not found").into_response()
            }
        }   
    }
}