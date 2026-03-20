// The service layer contains the core logic of the upload pipeline.
use axum::extract::Multipart;
use sqlx::SqlitePool;
use uuid::Uuid;
use tokio::io::AsyncWriteExt;
use chrono::Utc;
use argon2::{Argon2, PasswordHasher};
use password_hash::SaltString;
use rand::thread_rng;

use crate::repository::file_repo::insert_file_metadata; // repository function that handles database insertion

pub async fn handle_upload(
    pool: &SqlitePool,
    multipart: &mut Multipart, // Mutable reference to the multipart request stream
) -> Result<String, Box<dyn std::error::Error>> {
    let mut password: Option<String> = None;
    let mut expires_at: Option<i64> = None;
    let mut max_downloads: Option<i64> = None;

    // Iterating throught the multipart requests
    while let Some(mut field) = multipart.next_field().await? {
        let field_name = field.name().unwrap_or("").to_string();
        
        if field_name == "password" {
            let pwd = field.text().await?;
            if !pwd.trim().is_empty() {
                password = Some(pwd);
            }
            continue;
        } else if field_name == "expiry" {
            let expiry_str = field.text().await?;
            if let Ok(hours) = expiry_str.parse::<i64>() {
                if hours > 0 {
                    expires_at = Some(Utc::now().timestamp() + (hours * 3600));
                }
            }
            continue;
        } else if field_name == "max_downloads" {
            let max_str = field.text().await?;
            if let Ok(max_dls) = max_str.parse::<i64>() {
               if max_dls > 0 {
                   max_downloads = Some(max_dls);
               }
            }
            continue;
        }

        let filename = field.file_name().unwrap_or("file").to_string();
        let file_id = Uuid::new_v4().to_string(); 
        let storage_path = format!("storage/{}", file_id);
        println!("Saving file to: {}", storage_path);
        let mut file = tokio::fs::File::create(&storage_path).await?; // Create a new file on disk using Tokio's async filesystem API
        let mut file_size = 0;
        
        // Stream the uploaded file in chunks so that the entire file isn't loaded at once into the memory
        while let Some(chunk) = field.chunk().await? {
            file_size += chunk.len() as i64;
            file.write_all(&chunk).await?;
        }
        let password_hash = if let Some(pwd) = &password {

            let salt = SaltString::generate(&mut thread_rng());

            Some(
                Argon2::default()
                    .hash_password(pwd.as_bytes(), &salt)
                    .map_err(|e| e.to_string())?
                    .to_string()
            )

        } else {
            None
        };
        insert_file_metadata(
            pool,
            &file_id,
            &filename,
            &storage_path,
            file_size,
            Utc::now().timestamp(),
            password_hash.as_deref(),
            expires_at,
            max_downloads,
        ).await?;

        let frontend_url = std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3000".to_string());
        return Ok(format!("{}/f/{}", frontend_url, file_id));
    }

    Err("No file found in upload".into())
}