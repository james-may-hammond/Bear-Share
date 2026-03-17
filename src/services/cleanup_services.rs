use sqlx::{SqlitePool, Row};
use chrono::Utc;

pub async fn cleanup_expired_files(pool: &SqlitePool) {

    let now = Utc::now().timestamp();

    let rows = sqlx::query(
        r#"
        SELECT id, storage_path
        FROM files
        WHERE expires_at IS NOT NULL
        AND expires_at < ?
        "#
    )
    .bind(now)
    .fetch_all(pool)
    .await;

    let rows = match rows {
        Ok(r) => r,
        Err(e) => {
            eprintln!("Cleanup query failed: {}", e);
            return;
        }
    };

    for row in rows {

        let id: String = row.get("id");
        let path: String = row.get("storage_path");

        println!("Cleaning expired file {}", id);

        // delete file from disk
        let _ = tokio::fs::remove_file(&path).await;

        // remove metadata
        let _ = sqlx::query(
            "DELETE FROM files WHERE id = ?"
        )
        .bind(id)
        .execute(pool)
        .await;
    }
}