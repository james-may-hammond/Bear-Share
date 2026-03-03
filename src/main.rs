use axum::{routing::{get, post}, Router};
use sqlx::SqlitePool;
mod routes;
mod services;
mod repository;

use routes::upload::upload;
#[tokio::main]
async fn main() {
    let pool = SqlitePool::connect("sqlite://db.sqlite").await.expect("Failed to connect to DB");
    let app = Router::new().route("/health",get(health)).route("/upload", post(upload)).with_state(pool);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    println!("Server running on http://localhost:3000");

    axum::serve(listener,app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}