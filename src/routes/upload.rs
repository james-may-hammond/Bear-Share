// handles Multipart extraction and HTTP response formatting
// This module defines the HTTP route handler for file uploads
use axum::{extract::{Multipart, State}, response::IntoResponse}; // Extractors for pulling data from requests and returning HTTP responses
use sqlx::SqlitePool;

use crate::services::file_services::handle_upload;

// HTTP Handler for /upload endpoint
pub async fn upload(
		// Extract shared application state (the SQLite connection pool)
    State(pool): State<SqlitePool>,
    // Extract the multipart form data from the request
    mut multipart: Multipart,
) -> impl IntoResponse {
		// Using the crate we've created in file_services
    match handle_upload(&pool, &mut multipart).await {
        Ok(link) => link,
        Err(e) => {
            eprintln!("Upload error: {}", e);
            "Upload failed".to_string()
        }
    }
}