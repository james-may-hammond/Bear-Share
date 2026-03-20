FROM rust:1.80-slim-bullseye AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
WORKDIR /app/data
COPY --from=builder /app/target/release/bear_share /usr/local/bin/bear_share
# Runtime environments
ENV DATABASE_URL="sqlite:db.sqlite?mode=rwc"
ENV PORT=8080
EXPOSE 8080

CMD ["bear_share"]
