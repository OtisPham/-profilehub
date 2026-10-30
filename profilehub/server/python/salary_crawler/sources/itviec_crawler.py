"""
ITviec Tech Salary Insights Module
Extracts ITviec report benchmark insights and demand signals.
"""
from typing import Dict, Any

class ITViecCrawler:
    def get_market_demand(self, role_id: str) -> Dict[str, Any]:
        """Provides IT market demand indicators and tech premiums based on ITviec's quarterly report."""
        high_demand_roles = ["ai_ml_engineer", "devops_cloud", "backend_nodejs", "data_engineer"]
        
        is_very_hot = role_id in high_demand_roles
        
        return {
            "source": "ITviec IT Salary Report 2026",
            "demand": "VERY_HOT" if is_very_hot else "HOT",
            "demand_label": "Rất cao (Khan hiếm nhân sự)" if is_very_hot else "Nhu cầu cao & Ổn định",
            "remote_available": True
        }
