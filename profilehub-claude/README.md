# PROFILEHUB · Career Discovery Chat MVP

Backend (Supabase + Edge Functions) cho feature đầu tiên: **Career Discovery Chat**.
Không bao gồm Resume Builder, JD Matching, Interview Coach, Career Card, Recruiter Dashboard.

## Cấu trúc

```
supabase/
├── config.toml.snippet                 # cấu hình function `api`
├── migrations/20260930000000_career_discovery_mvp.sql
├── functions/
│   ├── api/index.ts                    # Router + 4 endpoint
│   └── _shared/
│       ├── types.ts                    # Types + zod schemas (single source of truth)
│       ├── validation.ts               # Validation Logic (request + CV Intelligence rules)
│       ├── extraction.ts               # Extraction Engine + merge
│       ├── planner.ts                  # Planner tất định (hỏi gì tiếp theo)
│       ├── agent.ts                    # Career Discovery Agent (prompt + fallback)
│       ├── scoring.ts                  # Employability score + strengths
│       ├── career-dna.ts               # Career DNA Generator
│       ├── summary.ts                  # Career Summary Generator
│       ├── repo.ts / http.ts / llm.ts / text.ts
└── tests/logic_test.ts                 # deno test (không cần mạng)
```

## Triển khai

```bash
supabase link --project-ref <ref>
supabase db push
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# tuỳ chọn:
supabase secrets set ANTHROPIC_MODEL_REPLY=claude-sonnet-5-5 \
                     ANTHROPIC_MODEL_EXTRACT=claude-haiku-4-5-20251001 \
                     ANTHROPIC_MODEL_GENERATE=claude-sonnet-5-5 \
                     CORS_ALLOW_ORIGIN=https://app.profilehub.vn
supabase functions deploy api
```

`SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` được Supabase tự inject vào Edge Function.

## API

Base: `https://<ref>.supabase.co/functions/v1/api` · Header: `Authorization: Bearer <user JWT>`

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/discovery/start` | `{ locale?: "vi"\|"en", force_new?: boolean }` | `{ session_id, resumed, turn_count, opening_message }` |
| POST | `/api/discovery/message` | `{ session_id, message }` | `{ reply, extracted_data, profile_updates }` |
| POST | `/api/discovery/finish` | `{ session_id }` | `{ career_profile, career_summary }` |
| GET | `/api/profile` | – | `{ profile }` (`null` nếu chưa có) |

Mã lỗi: `400 VALIDATION_ERROR` · `401 UNAUTHORIZED` · `404 SESSION_NOT_FOUND` · `409 SESSION_NOT_ACTIVE / CONCURRENT_UPDATE / SESSION_TURN_LIMIT` · `422 INSUFFICIENT_DATA` · `429 TOO_MANY_REQUESTS` · `503 EXTRACTION_UNAVAILABLE`.
Body lỗi: `{ error: { code, message, details?, request_id } }`.

### Thử nhanh

```bash
H='Authorization: Bearer '$JWT; U=https://<ref>.supabase.co/functions/v1/api
SID=$(curl -s -X POST $U/api/discovery/start -H "$H" -H 'content-type: application/json' -d '{}' | jq -r .session_id)
curl -s -X POST $U/api/discovery/message -H "$H" -H 'content-type: application/json' \
  -d "{\"session_id\":\"$SID\",\"message\":\"Tôi quản lý fanpage\"}" | jq
# → reply hỏi: tăng bao nhiêu follower, trong bao lâu, có kết quả gì
```

## Thiết kế chính

**Luồng một lượt chat:** `Extract (LLM tool) → Validate → Merge → Plan (tất định) → Reply (LLM) → Persist → Live Profile`.

- **Planner tất định, LLM chỉ lo cách hỏi.** Planner ưu tiên: task vừa nêu → ép thành thành tựu; thành tựu thiếu result/metric/timeframe → hỏi bám theo; rồi mới đi theo 8 category. Mỗi gap tối đa 2 lần hỏi, mỗi category tối đa 3 lượt → không thẩm vấn, luôn kết thúc được. User từ chối/không nhớ → đóng câu hỏi.
- **CV Intelligence Rules được cưỡng chế bằng code** (`validation.ts`), không chỉ bằng prompt:
  - *Metric > Description*: metric phải truy vết được về lời user (`verifyMetric`), số bịa bị loại.
  - *Achievement > Task*: không có result/metric → hạ xuống `task_claim`, kích hoạt câu hỏi tiếp.
  - *Không lưu nguyên văn*: `isVerbatim` từ chối, yêu cầu LLM viết lại 1 lần.
  - *Evidence > Self Claim*: evidence không có url/artifact = `self_claim`, trọng số điểm thấp hơn.
- **Employability score** tất định, có breakdown (30 thành tựu · 20 bằng chứng · 10 × 5 nhóm còn lại).
- **Career DNA** tính từ `dna_signals` có trọng số; LLM chỉ viết rationale và bị kiểm tra không được thêm số.
- **Chống bịa số ở summary**: `ungroundedNumbers` so mọi con số với dữ liệu thật; lỗi → retry → template fallback.
- **Bảo mật:** RLS chỉ cho SELECT; ghi qua service_role → client không tự sửa được score/DNA. User text luôn bọc `<user_message>` và coi là dữ liệu (chống prompt injection). Optimistic lock theo `version`; tối đa 1 session active/user.
- **Độ bền:** LLM reply lỗi → câu hỏi fallback theo plan; extraction lỗi → 503 (không mất dữ liệu, user gửi lại).

## Giới hạn đã biết / bước tiếp theo

- Chưa có rate-limit theo user ở tầng gateway (hiện chỉ giãn cách 700ms/session + tối đa 40 lượt).
- Chưa mã hoá/ẩn PII trong `messages` (nên bổ sung retention policy trước khi production).
- Dedupe tương đồng dùng Jaccard (ngưỡng 0.7), có thể bỏ sót các cách diễn đạt rất khác nhau.
- Mã chưa được chạy với Supabase/Anthropic thật trong môi trường tạo ra nó — hãy chạy `deno test` và một phiên e2e trên staging trước khi release.
