# 🔌 API Contract Specification — ProfileHub Core System

## 1. Authentication
* Tất cả các request yêu cầu Header `Authorization: Bearer <supabase_jwt_token>` (ngoại trừ các endpoint public).

## 2. Core Endpoints

### 2.1 Projects
#### `POST /functions/v1/projects-create`
* **Request Body:**
```json
{
  "title": "E-Commerce System",
  "description": "Website bán hàng React & Node.js",
  "github_url": "https://github.com/...",
  "demo_url": "https://demo...",
  "role": "Frontend Developer",
  "instructor": "TS. Tran Van B",
  "tags": ["React", "TypeScript", "TailwindCSS"]
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "project": {
    "id": "uuid-...",
    "student_id": "uuid-...",
    "title": "E-Commerce System",
    "verification_status": "pending",
    "is_verified": false
  }
}
```

#### `POST /functions/v1/projects-verify`
* **Request Body:**
```json
{
  "project_id": "uuid-...",
  "action": "verify", // "verify" | "reject"
  "teacher_feedback": "Đồ án đáp ứng đầy đủ yêu cầu môn học, mã nguồn sạch sẽ."
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "project_id": "uuid-...",
  "verification_status": "verified",
  "is_verified": true,
  "verified_at": "2026-09-29T14:00:00Z"
}
```

### 2.2 Profile
#### `GET /functions/v1/profile-get?id=<user_id>`
* **Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-...",
    "full_name": "Nguyen Van A",
    "email": "a@student.edu.vn",
    "role": "student"
  },
  "profile": {
    "major": "Khoa học Máy tính",
    "university": "Đại học Bách Khoa",
    "gpa": "3.6",
    "skills": ["React", "TypeScript", "Node.js"],
    "qr_code_url": "https://..."
  },
  "verified_projects_count": 3
}
```

### 2.3 Recruiter
#### `GET /functions/v1/recruiter-jobs`
* **Response (200 OK):**
```json
{
  "jobs": [
    {
      "id": "uuid-...",
      "title": "Frontend Developer (Fresher/Junior)",
      "department": "Engineering",
      "location": "TP. HCM",
      "required_skills": ["React", "TypeScript"],
      "status": "active"
    }
  ]
}
```

#### `POST /functions/v1/recruiter-pipeline-update`
* **Request Body:**
```json
{
  "pipeline_id": "uuid-...",
  "stage": "interview",
  "private_notes": "Ứng viên có đồ án verified tốt, mời phỏng vấn kỹ thuật."
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "pipeline_id": "uuid-...",
  "stage": "interview"
}
```