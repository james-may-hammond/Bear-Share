Since the project has a complete upload download pipeline, let us device a proper testing method

## Step - 1 : Start the server
```bash
cargo run
```
the server should be running on localhost

## Step - 2 : Test server health
```bash
curl http://localhost:3000/health
```
expected response: OK

## Step - 3 : Test Upload Pipeline
we create and upload a test file
```bash
echo "hello bear share system" > test.txt
curl -F "file=@test.txt" http://localhost:3000/upload
```
expected response: http://localhost:3000/f/[uuid]
verify that the file was written, by navigating into root's storage directory and verifying that a file with the same uuid exists
additionally you can run cat storage/[uuid] and it should give out the same output

## Step - 4 : Test Download Pipeline
```bash
curl http://localhost:3000/f/<uuid> -o downloaded.txt
cat downloaded.txt

diff test.txt downloaded.txt
```
Expected output
the text inside test.txt followed by nothing for the diff command

## Step - 5 : Testing Expiry Logic
Manually update sqlite db
```bash
sqlite3 db.sqlite
```
```sql
UPDATE files
SET expires_at = 0
WHERE id = "<uuid>";
```
```bash
.quit
curl http://localhost:3000/f/<uuid>
```
Expected output: File expired or not found