from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from unidecode import unidecode
from skill_mining import analyze_candidate_answer

app = Flask(__name__)
# Cho phép ứng dụng frontend React (ProfileHub) kết nối API
CORS(app)

KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), 'knowledge_base.json')

def load_knowledge_base():
    """Tải cơ sở tri thức từ file JSON"""
    if os.path.exists(KNOWLEDGE_BASE_PATH):
        with open(KNOWLEDGE_BASE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "welcome": {"answer": "Xin chào!", "suggestions": []},
        "default_fallback": {"answer": "Xin lỗi, tôi chưa hiểu yêu cầu.", "suggestions": []},
        "topics": []
    }

def find_best_matching_topic(user_message: str, data: dict):
    """Tìm chủ đề tư vấn CV & tiềm năng phù hợp nhất dựa trên từ khóa"""
    user_msg_raw = user_message.lower().strip()
    user_msg_no_accent = unidecode(user_msg_raw)
    
    best_topic = None
    max_score = 0

    for topic in data.get("topics", []):
        score = 0
        for kw in topic.get("keywords", []):
            kw_raw = kw.lower().strip()
            kw_no_accent = unidecode(kw_raw)
            
            # 1. Trùng khớp chính xác toàn cụm từ có dấu
            if kw_raw in user_msg_raw:
                score += 10 + len(kw_raw)
            # 2. Trùng khớp cụm từ không dấu
            elif kw_no_accent in user_msg_no_accent:
                score += 6 + len(kw_no_accent)
            else:
                # 3. Trùng khớp từng từ đơn lẻ
                words = [w for w in kw_no_accent.split() if len(w) > 1]
                matched_words = [w for w in words if w in user_msg_no_accent.split()]
                if matched_words:
                    score += len(matched_words) * 2

        if score > max_score:
            max_score = score
            best_topic = topic

    # Ngưỡng điểm tối thiểu
    if max_score >= 3 and best_topic:
        return best_topic
    return None

@app.route('/api/welcome', methods=['GET'])
def get_welcome():
    """API lấy tin nhắn chào mừng và gợi ý ban đầu cho ứng viên"""
    return jsonify({
        "status": "success",
        "answer": "Xin chào! 👋 Tôi là **AI Career & CV Coach** của ProfileHub.\n\nTôi sẽ phỏng vấn khai phá tiềm năng của bạn và tự động chuyển đổi câu trả lời thành **câu chuẩn STAR** để đưa vào CV.\n\nHãy chia sẻ với tôi: **Gần đây bạn đã tham gia hoặc làm đồ án/dự án công nghệ nào?**",
        "suggestions": [
            "Em từng làm web bán hàng bằng React & NodeJS",
            "Em làm đồ án Python phân tích dữ liệu & AI",
            "Em xây dựng Mobile App với React Native",
            "Em từng làm đồ án Java/Spring Boot & MySQL"
        ]
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """API xử lý câu hỏi tư vấn khai thác tiềm năng, nâng cấp CV chuẩn STAR & đào sâu câu hỏi"""
    payload = request.get_json() or {}
    user_message = payload.get('message', '').strip()

    if not user_message:
        return jsonify({
            "status": "error",
            "message": "Tin nhắn không được để trống"
        }), 400

    # 1. Ưu tiên phân tích bóc tách kỹ năng chuyên môn (Skill Mining Engine)
    skill_analysis = analyze_candidate_answer(user_message)
    if skill_analysis.get("status") == "success":
        return jsonify({
            "status": "success",
            "answer": skill_analysis["answer"],
            "detected_skills": skill_analysis.get("detected_skills", []),
            "upgraded_bullet_points": skill_analysis.get("upgraded_bullet_points", []),
            "next_deep_dive": skill_analysis.get("next_deep_dive", ""),
            "suggestions": skill_analysis.get("suggestions", []),
            "boost_exp": skill_analysis.get("boost_exp", 25)
        })

    # 2. So khớp cơ sở kiến thức chung (Knowledge Base)
    kb = load_knowledge_base()
    matched_topic = find_best_matching_topic(user_message, kb)

    if matched_topic:
        return jsonify({
            "status": "success",
            "answer": matched_topic["answer"],
            "detected_skills": [],
            "upgraded_bullet_points": [],
            "suggestions": matched_topic.get("suggestions", []),
            "boost_exp": 0
        })

    # 3. Trả lời hướng dẫn khai phá thêm (Fallback gợi mở)
    return jsonify({
        "status": "fallback",
        "answer": skill_analysis.get("answer", "Tôi đã ghi nhận chia sẻ của bạn. Hãy kể thêm về các công nghệ bạn đã sử dụng!"),
        "detected_skills": [],
        "upgraded_bullet_points": [],
        "next_deep_dive": skill_analysis.get("next_deep_dive", ""),
        "suggestions": skill_analysis.get("suggestions", []),
        "boost_exp": 0
    })

@app.route('/', methods=['GET'])
def index():
    """Trang chủ thử nghiệm trực tiếp Chatbot trên trình duyệt"""
    html_content = """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ProfileHub AI Career Coach - Test Dashboard</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #f1f5f9; color: #1e293b; padding: 24px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .container { background: white; width: 100%; max-width: 720px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 20px 24px; }
        .header h1 { font-size: 20px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .header p { font-size: 13px; opacity: 0.9; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
        .status-dot { width: 8px; height: 8px; background: #34d399; border-radius: 50%; }
        .chat-container { height: 420px; overflow-y: auto; padding: 20px; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; }
        .msg { max-width: 82%; padding: 12px 16px; border-radius: 14px; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
        .msg.bot { background: white; color: #1e293b; align-self: flex-start; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px; }
        .msg.user { background: #6d28d9; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
        .chips-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .chip { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; border-radius: 16px; padding: 6px 12px; font-size: 12px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .chip:hover { background: #6d28d9; color: white; }
        .footer { padding: 16px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; }
        .input-box { flex: 1; padding: 10px 16px; border: 1px solid #cbd5e1; border-radius: 24px; font-size: 14px; outline: none; }
        .input-box:focus { border-color: #7c3aed; }
        .send-btn { background: #6d28d9; color: white; border: none; padding: 10px 20px; border-radius: 24px; font-weight: 600; cursor: pointer; }
        .info-card { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 20px 0; border-radius: 6px; font-size: 13px; color: #1e40af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 ProfileHub AI Career Coach</h1>
          <p>Dịch vụ tư vấn khai thác tiềm năng ứng viên & nâng cấp CV</p>
          <div class="status-badge">
            <span class="status-dot"></span> API Server Online (Port 5000)
          </div>
        </div>

        <div class="info-card">
          💡 <strong>Lưu ý:</strong> Đây là cổng Backend API (Port 5000). Giao diện trang web chính của ProfileHub chạy tại <a href="http://localhost:5173" target="_blank" style="color: #2563eb; font-weight: bold;">http://localhost:5173</a>.
        </div>

        <div class="chat-container" id="chat"></div>

        <form class="footer" id="form">
          <input type="text" id="input" class="input-box" placeholder="Nhập câu hỏi (Ví dụ: cách viết dự án, ít kinh nghiệm, phương pháp STAR...)" />
          <button type="submit" class="send-btn">Gửi</button>
        </form>
      </div>

      <script>
        const chat = document.getElementById('chat');
        const form = document.getElementById('form');
        const input = document.getElementById('input');

        function addMessage(text, sender, suggestions = []) {
          const div = document.createElement('div');
          div.className = 'msg ' + sender;
          div.textContent = text;
          chat.appendChild(div);

          if (suggestions && suggestions.length > 0) {
            const chips = document.createElement('div');
            chips.className = 'chips-container';
            suggestions.forEach(s => {
              const label = typeof s === 'string' ? s : s.text;
              const btn = document.createElement('button');
              btn.className = 'chip';
              btn.textContent = '➤ ' + label;
              btn.onclick = () => { sendMessage(label); };
              chips.appendChild(btn);
            });
            chat.appendChild(chips);
          }
          chat.scrollTop = chat.scrollHeight;
        }

        async function init() {
          try {
            const res = await fetch('/api/welcome');
            const data = await res.json();
            addMessage(data.answer, 'bot', data.suggestions);
          } catch(e) {
            addMessage('Xin chào! Tôi là Trợ lý AI ProfileHub. Tôi có thể giúp gì cho bạn?', 'bot');
          }
        }

        async function sendMessage(text) {
          if (!text.trim()) return;
          addMessage(text, 'user');
          input.value = '';

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            addMessage(data.answer, 'bot', data.suggestions);
          } catch(e) {
            addMessage('⚠️ Lỗi kết nối máy chủ.', 'bot');
          }
        }

        form.onsubmit = (e) => {
          e.preventDefault();
          sendMessage(input.value);
        };

        init();
      </script>
    </body>
    </html>
    """
    return html_content

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ProfileHub Python Career Coach API"})

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5000
    try:
        from waitress import serve
        print(f"🚀 [Production WSGI - Waitress] ProfileHub Career Coach đang chạy tại: http://localhost:{port}")
        serve(app, host=host, port=port, threads=6)
    except ImportError:
        print(f"🚀 [Development Server] ProfileHub Career Coach đang chạy tại: http://localhost:{port}")
        print("💡 Cài đặt 'pip install waitress' để chạy chế độ Production WSGI chuẩn.")
        app.run(host=host, port=port, debug=False)
