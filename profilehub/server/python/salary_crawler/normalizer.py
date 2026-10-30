"""
Salary & Seniority Normalization Module
ProfileHub - Real Market Salary Pipeline
"""
import re
from typing import Tuple, List, Dict
from config import USD_EXCHANGE_RATE

TECH_PREMIUM_CATALOG: Dict[str, int] = {
    "golang": 15,
    "go": 15,
    "rust": 20,
    "kubernetes": 18,
    "docker": 10,
    "aws": 15,
    "gcp": 15,
    "microservices": 15,
    "ai": 25,
    "llm": 25,
    "langchain": 20,
    "python": 12,
    "react": 10,
    "typescript": 10,
    "nestjs": 12,
    "kafka": 15,
    "redis": 10,
    "postgresql": 8,
    "mongodb": 8,
    "solidity": 25,
    "flutter": 12,
    "graphql": 10
}

def clean_currency_text(val_str: str) -> int:
    """Extract clean numeric VND amount from Vietnamese salary representation."""
    if not val_str:
        return 0
    
    val = val_str.strip().lower()
    
    # Check for USD
    is_usd = '$' in val or 'usd' in val
    
    # Handle 'triệu' or 'tr'
    if 'triệu' in val or ' tr' in val or val.endswith('tr'):
        numbers = re.findall(r'[\d\.,]+', val)
        if numbers:
            num = float(numbers[0].replace(',', '.'))
            return int(num * 1_000_000)
    
    # Handle pure digits
    digits = re.sub(r'[^\d]', '', val)
    if not digits:
        return 0
    amount = int(digits)
    
    if is_usd:
        amount = amount * USD_EXCHANGE_RATE
        
    return amount

def parse_salary_range(salary_str: str) -> Tuple[int, int]:
    """
    Parses complex salary strings:
    - '14 - 18 triệu VND' -> (14000000, 18000000)
    - '15 - 22 triệu' -> (15000000, 22000000)
    - 'Lên đến 30 triệu' -> (20000000, 30000000)
    - 'Từ 12 triệu' -> (12000000, 16000000)
    - '$800 - $1200' -> (20320000, 30480000)
    """
    if not salary_str:
        return (0, 0)
    
    text = salary_str.strip().lower()
    
    # Range with hyphen or tilde: '14 - 18 triệu', '15 ~ 20 tr', '$1000 - $1500'
    match_range = re.search(r'([\d\.,]+)\s*(?:tr|triệu|usd|\$)?\s*[-~–]\s*([\d\.,]+)\s*(tr|triệu|vnd|usd|\$)?', text)
    if match_range:
        low_raw = match_range.group(1).replace(',', '.')
        high_raw = match_range.group(2).replace(',', '.')
        unit = match_range.group(3) or ('usd' if '$' in text or 'usd' in text else 'triệu')
        
        try:
            low_val = float(low_raw)
            high_val = float(high_raw)
            
            if 'usd' in unit or '$' in unit:
                return (int(low_val * USD_EXCHANGE_RATE), int(high_val * USD_EXCHANGE_RATE))
            else:
                # If values are in millions (e.g. 14 - 18)
                if low_val < 1000:
                    return (int(low_val * 1_000_000), int(high_val * 1_000_000))
                return (int(low_val), int(high_val))
        except ValueError:
            pass
            
    # Single values: 'Lên đến 25 triệu', 'Tới 30 Tr'
    match_up_to = re.search(r'(?:lên đến|tới|dưới|up to)\s*([\d\.,]+)\s*(tr|triệu|usd|\$)?', text)
    if match_up_to:
        high_raw = match_up_to.group(1).replace(',', '.')
        try:
            high_val = float(high_raw)
            is_usd = 'usd' in text or '$' in text
            multiplier = USD_EXCHANGE_RATE if is_usd else (1_000_000 if high_val < 1000 else 1)
            high_vnd = int(high_val * multiplier)
            low_vnd = int(high_vnd * 0.7)  # standard low threshold
            return (low_vnd, high_vnd)
        except ValueError:
            pass

    return (0, 0)

def normalize_seniority(text: str) -> str:
    """Map job title or description to standard seniority level."""
    lower = text.lower()
    if any(k in lower for k in ['lead', 'architect', 'trưởng nhóm', 'tech lead', 'quản lý']):
        return 'lead'
    if any(k in lower for k in ['senior', 'cao cấp', '5 năm', '4 năm']):
        return 'senior'
    if any(k in lower for k in ['mid-level', 'middle', 'mid', '2-3 năm', '3 năm']):
        return 'mid'
    if any(k in lower for k in ['junior', '1-2 năm', '1 năm', 'chuyên viên']):
        return 'junior'
    if any(k in lower for k in ['intern', 'thực tập', 'thực tập sinh', 'trainee']):
        return 'intern'
    return 'fresher'

def extract_tech_premiums(tech_list: List[str]) -> List[Dict[str, int]]:
    """Calculate market premium percentages for specific tech skills."""
    result = []
    seen = set()
    for tech in tech_list:
        clean = tech.strip().lower()
        for catalog_key, premium in TECH_PREMIUM_CATALOG.items():
            if catalog_key in clean or clean in catalog_key:
                if catalog_key not in seen:
                    seen.add(catalog_key)
                    result.append({"tech": tech, "premium_percent": premium})
                break
    return result
