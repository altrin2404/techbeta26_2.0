"""
TechBETA 2026 2.0 - Upload Certificates to Supabase Storage
Automated CDN uploader for 159 participation certificates.
"""

import os
import sys
import json
import time
import requests

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CERT_DIR = os.path.join(BASE_DIR, "Certificates")
DATA_JSON = os.path.join(BASE_DIR, "src", "data", "certificates.json")
ENV_FILE = os.path.join(BASE_DIR, ".env")

def load_env():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def main():
    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not supabase_url or not service_key:
        print("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
        sys.exit(1)

    headers = {
        "Authorization": f"Bearer {service_key}",
        "apiKey": service_key
    }

    bucket_name = "certificates"
    storage_api = f"{supabase_url}/storage/v1"

    print("=" * 65)
    print("SUPABASE STORAGE - CERTIFICATES UPLOADER")
    print(f"Target Project: {supabase_url}")
    print(f"Target Bucket:  {bucket_name}")
    print("=" * 65)

    # 1. Check / Create Bucket
    print("\n1. Verifying storage bucket...")
    r = requests.get(f"{storage_api}/bucket", headers=headers, timeout=15)
    if r.status_code != 200:
        print(f"Failed to list buckets: {r.status_code} {r.text}")
        sys.exit(1)

    buckets = [b["name"] for b in r.json()]
    if bucket_name not in buckets:
        print(f"Creating public bucket '{bucket_name}'...")
        create_payload = {
            "id": bucket_name,
            "name": bucket_name,
            "public": True,
            "file_size_limit": 52428800,  # 50MB per file
            "allowed_mime_types": ["image/png", "image/jpeg"]
        }
        cr = requests.post(f"{storage_api}/bucket", headers=headers, json=create_payload, timeout=15)
        if cr.status_code in (200, 201):
            print(f"✓ Bucket '{bucket_name}' created successfully as PUBLIC.")
        else:
            print(f"Bucket creation response: {cr.status_code} {cr.text}")
    else:
        print(f"✓ Bucket '{bucket_name}' already exists.")
        # Ensure it's public
        requests.put(f"{storage_api}/bucket/{bucket_name}", headers=headers, json={"public": True}, timeout=10)

    # 2. Load certificate list
    with open(DATA_JSON, "r", encoding="utf-8") as f:
        records = json.load(f)

    print(f"\n2. Uploading {len(records)} certificates to Supabase Storage...")
    success_count = 0
    failed_count = 0

    for i, cert in enumerate(records, 1):
        folder = cert["folder"]
        filename = cert["filename"]
        local_path = os.path.join(CERT_DIR, folder, filename)

        if not os.path.exists(local_path):
            print(f"[{i}/{len(records)}] ❌ Local file not found: {local_path}")
            failed_count += 1
            continue

        # Object path in bucket: e.g. "UI_Verse/Janeha_J.png"
        remote_path = f"{folder}/{filename}".replace("\\", "/")
        upload_url = f"{storage_api}/object/{bucket_name}/{remote_path}"

        upload_headers = {
            "Authorization": f"Bearer {service_key}",
            "apiKey": service_key,
            "Content-Type": "image/png",
            "x-upsert": "true"
        }

        with open(local_path, "rb") as f_data:
            file_bytes = f_data.read()

        print(f"[{i:03d}/{len(records)}] Uploading {cert['event']} - {cert['name']} ({len(file_bytes) / 1024:.1f} KB)...", end="", flush=True)

        try:
            up_r = requests.post(upload_url, headers=upload_headers, data=file_bytes, timeout=60)
            if up_r.status_code in (200, 201):
                print(" ✓ Done")
                success_count += 1
            else:
                print(f" ❌ Failed ({up_r.status_code}): {up_r.text}")
                failed_count += 1
        except Exception as e:
            print(f" ❌ Error: {e}")
            failed_count += 1

    print("\n" + "=" * 65)
    print("UPLOAD SUMMARY:")
    print(f"  Successfully Uploaded: {success_count} / {len(records)}")
    print(f"  Failed:                {failed_count}")
    public_sample = f"{storage_api}/object/public/{bucket_name}/{records[0]['folder']}/{records[0]['filename']}"
    print(f"  Sample Public URL:     {public_sample}")
    print("=" * 65)

if __name__ == "__main__":
    main()
