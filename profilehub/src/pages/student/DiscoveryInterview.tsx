import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { ChatWindow } from '../../features/discovery/ChatWindow';
import { LiveProfilePanel } from '../../features/discovery/LiveProfilePanel';
import { discoveryService } from '../../services/discoveryService';
import type { ChatMessage, PublicPendingFact, CareerDNA } from '../../types';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export default function DiscoveryInterview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [pendingFacts, setPendingFacts] = useState<PublicPendingFact[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishResult, setFinishResult] = useState<any>(null);

  const [careerDNA, setCareerDNA] = useState<CareerDNA>({
    employabilityScore: 75,
    careerStrength: 75,
    marketPosition: 'Builder',
    topStrengths: ['Problem Solving', 'Tech Stack'],
    skillsDiscovered: [],
    recommendedRoles: ['Frontend Developer', 'Fullstack Engineer'],
    discoveryProgress: 20,
  });

  // Khởi tạo phiên phỏng vấn Discovery
  useEffect(() => {
    async function initSession() {
      const session = await discoveryService.startSession(user?.id);
      setSessionId(session.sessionId);

      setMessages([
        {
          id: 'msg-welcome',
          sender: 'ai',
          content: session.openingMessage,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    initSession();
  }, [user?.id]);

  // Xử lý gửi tin nhắn tới Gemini
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const result = await discoveryService.sendMessage(sessionId, text);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        content: result.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        facts: result.facts,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Cập nhật facts mới vào bảng bên phải
      if (result.facts && result.facts.length > 0) {
        setPendingFacts((prev) => [...result.facts, ...prev]);
      }

      // Cập nhật Career DNA & Progress
      if (result.updatedDNA) {
        setCareerDNA((prev) => ({
          ...prev,
          ...result.updatedDNA,
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Xác nhận hoặc từ chối Fact trích xuất
  const handleResolveFact = async (factId: string, action: 'confirm' | 'reject') => {
    await discoveryService.resolveFact(factId, action);
    setPendingFacts((prev) =>
      prev.map((f) => (f.id === factId ? { ...f, status: action === 'confirm' ? 'confirmed' : 'rejected' } : f))
    );
  };

  // Hoàn tất phỏng vấn và xuất sang CV
  const handleFinishSession = async () => {
    setIsFinishing(true);
    try {
      const data = await discoveryService.finishSession(sessionId, user?.id);
      const summaryText =
        data?.career_summary ||
        data?.career_profile?.career_summary ||
        (pendingFacts.length > 0
          ? `Chuyên viên phát triển phần mềm với năng lực giải quyết vấn đề và thế mạnh về ${careerDNA.topStrengths.join(', ')}. Đã tham gia các dự án thực tế với kết quả đo lường rõ ràng.`
          : '');

      if (summaryText) {
        localStorage.setItem('ai_discovery_summary', summaryText);
      }
      if (data?.career_profile) {
        localStorage.setItem('ai_discovery_profile', JSON.stringify(data.career_profile));
      }

      if (data) {
        setFinishResult({ ...data, career_summary: summaryText });
      } else {
        navigate('/cv-builder', { state: { discoverySummary: summaryText } });
      }
    } catch (err) {
      console.error('Finish session error:', err);
      navigate('/cv-builder');
    } finally {
      setIsFinishing(false);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-20px)] w-full bg-slate-50 overflow-hidden">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white px-6 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>
            <strong>AI Career Discovery:</strong> Phỏng vấn tương tác khai phá năng lực & tự động trích xuất thông tin đưa vào CV nổi bật.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFinishSession}
            disabled={isFinishing}
            className="bg-white text-blue-800 hover:bg-blue-50 px-3.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isFinishing ? 'AI Đang Tổng Hợp...' : '✨ Hoàn Tất & Xuất CV'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Content: Chat Window + Live Profile Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-white">
          <ChatWindow
            messages={messages}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            onResolveFact={handleResolveFact}
          />
        </div>

        {/* Right: Live Profile & Career DNA Panel */}
        <div className="w-80 lg:w-96 flex-shrink-0 h-full border-l border-gray-200 bg-white">
          <LiveProfilePanel
            careerDNA={careerDNA}
            pendingFacts={pendingFacts}
            onResolveFact={handleResolveFact}
          />
        </div>
      </div>

      {/* Modal Hoàn thành & Tóm tắt CV */}
      {finishResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              🎉 Hoàn Thành Khai Phá Năng Lực AI!
            </h3>
            <p className="text-sm text-gray-600 text-center mb-5">
              Gemini đã phân tích toàn bộ cuộc phỏng vấn và trích xuất hồ sơ tóm tắt cho CV của bạn.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-left text-xs leading-relaxed text-slate-800">
              <div className="font-bold text-blue-900 mb-1">📌 Career Summary:</div>
              <p className="mb-3">{finishResult.career_summary || finishResult.career_profile?.career_summary}</p>

              {finishResult.career_profile?.headline && (
                <div className="font-bold text-slate-900 mb-1">
                  🎯 Tiêu đề: <span className="font-normal">{finishResult.career_profile.headline}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setFinishResult(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <RotateCcw size={14} /> Tiếp tục chat
              </button>
              <button
                onClick={() =>
                  navigate('/cv-builder', {
                    state: {
                      discoverySummary: finishResult?.career_summary || finishResult?.career_profile?.career_summary,
                      discoveryProfile: finishResult?.career_profile,
                    },
                  })
                }
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                Mở AI CV Builder <ArrowRight size={14} />
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
