🚀 PROFILEHUB PRODUCT ROADMAP 2026-2027
Hệ Sinh Thái Nghề Nghiệp Sinh Viên - Doanh Nghiệp - Nhà Trường
Phiên bản tái cấu trúc từ góc nhìn Product Manager.

Nguyên tắc:

Xây nền tảng dữ liệu trước.
Tạo giá trị cốt lõi (Company Hub).
Tạo traffic và retention (Feed).
Tạo engagement (Like, Comment, Follow).
Tối ưu chuyển đổi tuyển dụng.
Chỉ triển khai AI khi đã có dữ liệu thực tế.
🎯 Product Vision
Biến ProfileHub từ nền tảng CV & tuyển dụng thành:

"Career Social Ecosystem dành cho Sinh viên, Doanh nghiệp và Nhà trường"

Kết hợp sức mạnh của:

LinkedIn Company Pages
Facebook Feed
ITviec Employer Branding
Handshake University Network
🏗️ Kiến Trúc Hệ Sinh Thái
flowchart TD

Student["👨‍🎓 Sinh viên"]
Company["🏢 Doanh nghiệp"]
University["🎓 Nhà trường"]

Home["🏠 Home Feed"]
Jobs["💼 Job Marketplace"]
Community["👥 Career Community"]
Companies["🏢 Company Hub"]
ATS["📋 Recruitment Pipeline"]
AI["🤖 AI Career Assistant"]

Student --> Home
Student --> Jobs
Student --> Community
Student --> Companies

Company --> Companies
Company --> Jobs
Company --> ATS

University --> Community

Home --> Companies
Home --> Jobs

Jobs --> ATS

ATS --> AI
Community --> AI
Companies --> AI
📍 PHASE 0
Foundation & Data Layer
Mục tiêu
Xây dựng nền tảng dữ liệu chuẩn làm cơ sở cho toàn bộ hệ sinh thái.

Deliverables
Company Profile
Company Name
Logo
Cover
Description
Website
Address
Industry
Company Size
Tech Stack
React
Angular
NodeJS
Java
.NET
Python
AWS
Azure
GCP
Benefits
Hybrid Working
Remote
MacBook
Healthcare
Training Budget
Bonus
Job Entity
Job
Department
Salary
Location
Status
Company
Social Entity
Follow
Post
Comment
Like
Notification
Data Synchronization
Realtime Update
Storage Events
Caching Layer
KPI
100 Company Profiles

500 Job Records

1000 Registered Users
📍 PHASE 1
Company Hub MVP
Mục tiêu
Tạo trung tâm thương hiệu doanh nghiệp.

Chức năng
1. Company Profile
Cover Banner
Logo
Slogan
Company Information
Quick Statistics
2. Tech Stack
Frontend
Backend
Cloud
Database
DevOps
3. Benefits & Culture
Work Environment
Benefits
Office Images
Culture Gallery
4. Company Feed
HR có thể đăng:

Tin tuyển dụng

Workshop

Tech Blog

Sự kiện sinh viên

Hoạt động doanh nghiệp
5. Follow Company
Follow

Unfollow

Follower Counter
6. One Click Apply
Nộp CV nhanh

Lưu việc làm

Theo dõi trạng thái
KPI
30% Company có bài đăng

20% User Follow ít nhất 1 công ty

10% User Apply Job
📍 PHASE 2
Home Feed & Discovery
Mục tiêu
Tạo lý do để người dùng quay lại hàng ngày.

Home Feed
Bài viết doanh nghiệp

Workshop

Tech Blog

Job Update

Campus Events
Feed Ranking V1
Newest First
Feed Ranking V2
Follow Based

Interest Based

Activity Based
Discovery Hub
Discover Companies
Top Companies

Newest Companies

Trending Companies
Discover Jobs
Newest Jobs

Popular Jobs

Recommended Jobs
KPI
DAU > 30%

User đọc 3 bài / phiên

Average Session > 5 phút
📍 PHASE 3
Engagement Layer
Mục tiêu
Tăng tương tác và giữ chân người dùng.

Social Actions
Like
❤️ Like Post
Comment
💬 Comment
Share
📤 Share
Save
🔖 Save Post
Notification Center
Sinh viên
Công ty Follow đăng bài

Có Job mới

Có phản hồi ứng tuyển
Doanh nghiệp
Có người Follow

Có Comment

Có Ứng viên mới
KPI
30% bài viết có Like

15% bài viết có Comment

40% User bật Notification
📍 PHASE 4
Career Community
Mục tiêu
Biến nền tảng từ Job Portal thành Community Platform.

Student Posts
Sinh viên có thể đăng:

Project

Portfolio

Achievement

Competition

Hackathon
Lecturer Posts
Workshop

Research

Industry Events

Academic Collaboration
Community Groups
Frontend Community

Backend Community

AI Community

Data Science Community

Mobile Community

Cyber Security Community
Event Center
Career Fair

Seminar

Tech Talk

Hackathon
KPI
50% nội dung do cộng đồng tạo

20 bài viết cộng đồng mỗi ngày
📍 PHASE 5
Recruitment Ecosystem
Mục tiêu
Xây dựng hệ thống tuyển dụng hoàn chỉnh.

Recruitment Pipeline
flowchart LR

A[Applied]
--> B[Screening]
--> C[Interview]
--> D[Offer]
--> E[Hired]
Employer Dashboard
Metrics
Followers

Profile Views

Post Reach

Job Views

Apply Rate

Conversion Rate
Applicant Tracking System
Candidate Management
Screening

Interview

Evaluation

Offer

Hiring
KPI
1000 Applications / Month

70% Job có Applicant

20% Repeat Employers
📍 PHASE 6
Recommendation Engine
Mục tiêu
Cá nhân hóa trải nghiệm.

Company Recommendation
Ví dụ:

Follow FPT

=> KMS

=> NashTech

=> Axon
Job Recommendation
Dựa trên:

Skills

CV

Applications

Profile
Content Recommendation
Tech Blogs

Events

Career Posts
KPI
CTR Recommendation > 10%

20% lượt xem đến từ Recommendation
📍 PHASE 7
AI Career Layer
Điều kiện triển khai
Chỉ triển khai khi:

Đủ dữ liệu CV

Đủ dữ liệu Job

Đủ dữ liệu User Behavior
AI Match Score
CV ↔ Job Matching
AI CV Review
Điểm mạnh

Điểm yếu

Khuyến nghị cải thiện
AI Career Advisor
Gợi ý nghề nghiệp

Lộ trình học tập

Kỹ năng cần bổ sung
AI Interview Coach
Mock Interview

Suggested Answers

Interview Analysis
KPI
20% User sử dụng AI

NPS > 8

Tăng 15% Apply Success Rate
🎯 Feature Priority Matrix
P0 - Must Have
Company Profile

Jobs

Posts

Feed

Follow

Apply
P1 - Should Have
Like

Comment

Notification

Save

Share
P2 - Growth Features
Community

Groups

Events

Recommendations
P3 - Advanced Features
ATS

Employer Analytics

AI Matching

AI Career Assistant
🧭 Final Navigation Structure
🏠 Home

💼 Jobs

🏢 Companies

👥 Community

🎓 Events

🔔 Notifications

👤 Profile
📈 North Star Metrics
User Growth
Monthly Active Users (MAU)

Daily Active Users (DAU)

User Retention
Engagement
Posts / Day

Comments / Day

Likes / Day

Follows / Day
Recruitment
Applications

Interview Rate

Offer Rate

Hiring Rate
Business
Active Companies

Paid Companies

Employer Retention

Revenue
✅ Product Strategy Summary
Giai đoạn ưu tiên triển khai:

1. Foundation & Data Layer

2. Company Hub MVP

3. Home Feed

4. Follow + Apply

5. Engagement Layer

6. Career Community

7. Recruitment Ecosystem

8. Recommendation Engine

9. AI Career Platform
Mục tiêu cuối cùng:

👉 Từ Job Portal

→ Employer Branding Platform

→ Career Community

→ Career Ecosystem

→ AI Career Network