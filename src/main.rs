use axum::{routing::{get, post}, Router};
use sqlx::SqlitePool;
mod routes;
mod services;
mod repository;

use routes::upload::upload;
use routes::download::download;
use crate::services::cleanup_services::cleanup_expired_files;
#[tokio::main]
async fn main() {
    let pool = SqlitePool::connect("sqlite:db.sqlite?mode=rwc").await.expect("Failed to connect to DB");
    let cleanup_pool = pool.clone();
    let app = Router::new()
        .route("/health", get(health))
        .route("/upload", post(upload))
        .route("/f/:id", get(download))
        .with_state(pool);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tokio::spawn(async move {
        loop {
            cleanup_expired_files(&cleanup_pool).await;

            tokio::time::sleep(std::time::Duration::from_secs(60)).await;
        }
    });
    println!("Server running on http://localhost:3000");

    axum::serve(listener,app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}