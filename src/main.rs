use axum::{
    routing::{get, post}, 
    Router,
    response::Response,
    middleware::{self, Next},
    http::{Request, Method, header},
};
use axum::body::Body;
use sqlx::SqlitePool;
mod routes;
mod services;
mod repository;

use routes::upload::upload;
use routes::download::download;
use crate::services::cleanup_services::cleanup_expired_files;

// Simple CORS middleware
async fn cors_middleware(req: Request<Body>, next: Next) -> Response {
    if req.method() == Method::OPTIONS {
        let mut res = Response::builder()
            .status(200)
            .body(Body::empty())
            .unwrap();
        
        let headers = res.headers_mut();
        headers.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
        headers.insert(header::ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, OPTIONS".parse().unwrap());
        headers.insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type, Authorization, x-requested-with".parse().unwrap());
        return res;
    }

    let mut res = next.run(req).await;
    let headers = res.headers_mut();
    headers.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    headers.insert(header::ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, OPTIONS".parse().unwrap());
    headers.insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type, Authorization, x-requested-with".parse().unwrap());
    res
}

#[tokio::main]
async fn main() {
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:db.sqlite?mode=rwc".to_string());
    let pool = SqlitePool::connect(&db_url).await.expect("Failed to connect to DB");
    
    // Ensure the database schema exists (crucial for ephemeral deployments like Render)
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            storage_path TEXT NOT NULL,
            password_hash TEXT,
            expires_at INTEGER,
            max_downloads INTEGER,
            download_count INTEGER DEFAULT 0,
            file_size INTEGER NOT NULL,
            created_at INTEGER NOT NULL
        );
        "#
    )
    .execute(&pool)
    .await
    .expect("Failed to create database tables");

    let cleanup_pool = pool.clone();
    
    // Ensure the storage directory exists
    tokio::fs::create_dir_all("storage").await.unwrap_or_else(|e| println!("Failed to create storage dir: {}", e));

    let app = Router::new()
        .route("/health", get(health))
        .route("/upload", post(upload))
        .route("/f/:id", get(download))
        .layer(middleware::from_fn(cors_middleware))
        .with_state(pool);
        
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    
    tokio::spawn(async move {
        loop {
            cleanup_expired_files(&cleanup_pool).await;
            tokio::time::sleep(std::time::Duration::from_secs(60)).await;
        }
    });
    println!("Server running on http://{}", addr);

    axum::serve(listener,app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}