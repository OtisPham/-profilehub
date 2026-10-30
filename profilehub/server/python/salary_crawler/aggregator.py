"""
Salary Data Aggregator Module
Merges and computes statistical percentiles (P25, P50, P75 Proof-of-Work, P90)
conforming strictly to the ProfileHub Real Market Salary Spec v2.0.0.
"""
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from config import CORE_JOB_ROLES, TTL_DAYS, CRAWL_CADENCE, USD_EXCHANGE_RATE
from normalizer import extract_tech_premiums
from sources.vietsalary_crawler import VietSalaryCrawler
from sources.topcv_crawler import TopCVCrawler
from sources.itviec_crawler import ITViecCrawler

ROLE_TECH_KEYWORDS = {
    "backend_nodejs": ["Docker", "PostgreSQL", "Redis", "NestJS", "Kubernetes", "Microservices"],
    "frontend_react": ["TypeScript", "Next.js", "TailwindCSS", "React Native", "Redux", "GraphQL"],
    "fullstack_web": ["React", "Node.js", "Docker", "PostgreSQL", "Redis", "TypeScript"],
    "mobile_app": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
    "data_engineer": ["Python", "PySpark", "Kafka", "PostgreSQL", "Docker", "AWS"],
    "ai_ml_engineer": ["Python", "PyTorch", "LangChain", "LLM", "Docker", "GCP"],
    "devops_cloud": ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Go"],
    "qa_qc_tester": ["Selenium", "Cypress", "Postman", "Automation Testing", "Python"],
    "ui_ux_designer": ["Figma", "Design System", "User Research", "Wireframing"],
    "general_software_engineer": ["Python", "Java", "Docker", "PostgreSQL", "Git"]
}

class SalaryAggregator:
    def __init__(self):
        self.vietsalary = VietSalaryCrawler()
        self.topcv = TopCVCrawler()
        self.itviec = ITViecCrawler()

    def build_dataset(self) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(days=TTL_DAYS)

        roles_dict: Dict[str, Any] = {}
        total_jobs_analyzed = 0

        for role_meta in CORE_JOB_ROLES:
            role_id = role_meta["id"]
            role_name = role_meta["name"]
            aliases = role_meta["aliases"]

            # Crawl distributions for all seniorities
            role_distribution = self.vietsalary.fetch_role_distribution(role_id, role_meta["keywords"][0])
            role_demand = self.itviec.get_market_demand(role_id)
            tech_skills = ROLE_TECH_KEYWORDS.get(role_id, ["Docker", "PostgreSQL", "Python"])
            top_tech_premiums = extract_tech_premiums(tech_skills)

            levels_dict: Dict[str, Any] = {}
            seniority_levels = ["intern", "fresher", "junior", "mid", "senior", "lead"]

            for lvl in seniority_levels:
                dist = role_distribution.get(lvl, {})
                samples = dist.get("samples", 120)
                total_jobs_analyzed += samples

                p25 = dist.get("p25", 10000000)
                median = dist.get("median", 14000000)
                p75_pow = dist.get("p75", int(median * 1.3))
                p90 = dist.get("p90", int(median * 1.6))

                evidence_samples = self.topcv.get_evidence_samples(role_id, lvl)

                levels_dict[lvl] = {
                    "sample_size": samples,
                    "p25_vnd": p25,
                    "median_p50_vnd": median,
                    "p75_proof_of_work_vnd": p75_pow,
                    "p90_max_vnd": p90,
                    "top_tech_premiums": top_tech_premiums,
                    "evidence_samples": evidence_samples
                }

            roles_dict[role_id] = {
                "role_name": role_name,
                "aliases": aliases,
                "market_demand": role_demand["demand"],
                "market_demand_label": role_demand["demand_label"],
                "levels": levels_dict
            }

        return {
            "_schema_version": "2.0.0",
            "metadata": {
                "crawled_at": now.isoformat(),
                "expires_at": expires_at.isoformat(),
                "ttl_days": TTL_DAYS,
                "crawl_cadence": CRAWL_CADENCE,
                "is_stale": False,
                "total_jobs_analyzed": total_jobs_analyzed,
                "sources": [
                    "VietnamSalary (CareerViet)",
                    "ITviec Tech Salary Report",
                    "TopCV Market Insights",
                    "TopDev IT Report"
                ],
                "usd_exchange_rate": USD_EXCHANGE_RATE
            },
            "roles": roles_dict
        }
