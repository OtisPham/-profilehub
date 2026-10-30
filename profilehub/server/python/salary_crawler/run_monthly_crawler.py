"""
Executable Runner for Real Market Salary Crawler
Designed to be scheduled via cron (e.g. 0 2 1 * *) on the 1st of every month.
Can also be executed manually anytime for on-demand refreshing.
"""
import os
import sys
import json
import shutil
from pathlib import Path

# Add current folder to sys.path to allow clean imports
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from config import DATA_DIR, FRONTEND_DATA_DIR, OUTPUT_FILE, FRONTEND_OUTPUT_FILE, QUEUE_FILE
from aggregator import SalaryAggregator

def run_crawler():
    print("=" * 70)
    print(" [ProfileHub Real Market Salary Crawler] Starting Monthly Run...")
    print("=" * 70)

    # 1. Ensure output directories exist
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 2. Build aggregated dataset
    aggregator = SalaryAggregator()
    print("Crawling & Aggregating empirical market distributions...")
    dataset = aggregator.build_dataset()

    # 3. Write primary server data
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)
    print(f"Generated server dataset: {OUTPUT_FILE}")

    # 4. Sync directly to Vite frontend data folder
    with open(FRONTEND_OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)
    print(f"Synced frontend dataset: {FRONTEND_OUTPUT_FILE}")

    # 5. Initialize or preserve on-demand dynamic queue
    if not QUEUE_FILE.exists():
        initial_queue = {
            "pending_keywords": [],
            "completed_keywords": [],
            "last_processed_at": None
        }
        with open(QUEUE_FILE, "w", encoding="utf-8") as f:
            json.dump(initial_queue, f, ensure_ascii=False, indent=2)
        print(f"✅ Initialized dynamic on-demand queue: {QUEUE_FILE}")

    metadata = dataset.get("metadata", {})
    total_jobs = metadata.get("total_jobs_analyzed", 0)
    roles_count = len(dataset.get("roles", {}))

    print("-" * 70)
    print("  Crawl Completed Successfully!")
    print(f" Total Target Roles: {roles_count}")
    print(f" Total Job Postings Analyzed: {total_jobs:,}")
    print(f" Crawled At: {metadata.get('crawled_at')}")
    print(f" Expires At (TTL 30 Days): {metadata.get('expires_at')}")
    print("=" * 70)

if __name__ == "__main__":
    run_crawler()
