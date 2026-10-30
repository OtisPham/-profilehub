"""
Configuration for Real Market Salary Crawler
ProfileHub - Evidence-Based Career Ecosystem
"""
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
FRONTEND_DATA_DIR = BASE_DIR.parents[2] / "src" / "data"

OUTPUT_FILE = DATA_DIR / "real_market_salaries.json"
FRONTEND_OUTPUT_FILE = FRONTEND_DATA_DIR / "real_market_salaries.json"
QUEUE_FILE = DATA_DIR / "dynamic_queue.json"

# Crawl Schedule & Lifecycle
TTL_DAYS = 30
CRAWL_CADENCE = "MONTHLY_ONCE"
USD_EXCHANGE_RATE = 25400  # VND per USD in Q4 2026

# Rate Limiting
MIN_DELAY_SECONDS = 2.0
MAX_DELAY_SECONDS = 4.0

# HTTP Headers for Requests
DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html, application/xhtml+xml, */*; q=0.01',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}

# Target Job Roles & Industry Classifications
CORE_JOB_ROLES = [
    {
        "id": "backend_nodejs",
        "name": "Node.js Backend Developer",
        "aliases": ["backend", "nodejs", "node.js", "back-end", "backend developer", "lập trình nodejs"],
        "keywords": ["node.js", "nodejs", "backend nodejs", "expressjs", "nestjs"]
    },
    {
        "id": "frontend_react",
        "name": "React / Frontend Developer",
        "aliases": ["frontend", "react", "reactjs", "front-end", "web frontend", "lập trình react"],
        "keywords": ["reactjs", "frontend react", "vuejs", "nextjs", "typescript frontend"]
    },
    {
        "id": "fullstack_web",
        "name": "Fullstack Web Developer",
        "aliases": ["fullstack", "full stack", "full-stack", "lập trình fullstack"],
        "keywords": ["fullstack developer", "fullstack web", "react nodejs fullstack"]
    },
    {
        "id": "mobile_app",
        "name": "Mobile App Developer (Flutter / React Native / iOS / Android)",
        "aliases": ["mobile", "flutter", "react native", "ios", "android", "lập trình di động"],
        "keywords": ["flutter developer", "react native", "ios swift", "android kotlin"]
    },
    {
        "id": "data_engineer",
        "name": "Data Engineer / Analytics Engineer",
        "aliases": ["data engineer", "kỹ sư dữ liệu", "etl", "big data", "bi developer"],
        "keywords": ["data engineer", "pyspark", "data warehouse", "sql data engineer"]
    },
    {
        "id": "ai_ml_engineer",
        "name": "AI / Machine Learning / LLM Engineer",
        "aliases": ["ai", "machine learning", "ml engineer", "deep learning", "nlp", "llm engineer", "trí tuệ nhân tạo"],
        "keywords": ["ai engineer", "machine learning", "computer vision", "llm", "langchain"]
    },
    {
        "id": "devops_cloud",
        "name": "DevOps / Cloud Engineer",
        "aliases": ["devops", "cloud engineer", "sre", "aws engineer", "infrastructure engineer"],
        "keywords": ["devops engineer", "cloud aws", "kubernetes devops", "ci/cd engineer"]
    },
    {
        "id": "qa_qc_tester",
        "name": "QA / QC / Automation Test Engineer",
        "aliases": ["qa", "qc", "tester", "kiem thu", "automation test", "qa engineer"],
        "keywords": ["qa qc", "tester manual", "automation tester", "selenium cypress"]
    },
    {
        "id": "ui_ux_designer",
        "name": "UI/UX Product Designer",
        "aliases": ["ui/ux", "product designer", "ui designer", "ux designer", "thiết kế giao diện"],
        "keywords": ["ui ux designer", "product designer figma", "web designer"]
    },
    {
        "id": "general_software_engineer",
        "name": "Kỹ Sư Phần Mềm (Software Engineer)",
        "aliases": ["software engineer", "kỹ sư phần mềm", "developer", "lập trình viên", "it software"],
        "keywords": ["software engineer", "developer c# .net", "java developer", "golang developer"]
    }
]
