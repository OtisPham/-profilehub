import type { MBTIType, MBTIDimensions, MBTIProfileInfo, MBTIQuestion, CandidateMBTIResult, RoleMBTIPersona, DualMBTIMatchAnalysis } from '../types/mbti';

export const MBTI_PROFILES: Record<MBTIType, MBTIProfileInfo> = {
  INTJ: {
    type: 'INTJ',
    title: 'The Mastermind / Strategic Architect',
    vietnameseTitle: 'Nhà Kiến Thiết Chiến Lược',
    tagline: 'Tư duy hệ thống sâu sắc, nhìn xa trông rộng và luôn hướng tới giải pháp tối ưu.',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    strengths: ['Tư duy kiến trúc hệ thống', 'Khả năng lập kế hoạch chiến lược', 'Giải quyết vấn đề phức tạp độc lập', 'Tiêu chuẩn chất lượng cao'],
    workStyle: 'Thích làm việc tự chủ, tập trung sâu, xây dựng cấu trúc bài bản và loại bỏ sự lộn xộn.',
    idealTeamRole: 'Software Architect, Tech Lead, System Analyst hoặc R&D Specialist.',
    communicationStyle: 'Rõ ràng, trực tiếp, tập trung vào logic, dữ liệu và mục tiêu tổng thể.',
    growthAreas: ['Cần kiên nhẫn hơn khi giải thích cho đồng đội phi kỹ thuật', 'Lắng nghe phản hồi cảm xúc của nhóm'],
    behavioralQuestions: [
      'Khi dự án cần triển khai gấp nhưng bạn thấy kiến trúc chưa thực sự tối ưu, bạn sẽ cân bằng giữa thời gian và chất lượng như thế nào?',
      'Hãy kể về một lần bạn thuyết phục đồng đội hoặc cấp trên đồng thuận với một giải pháp kỹ thuật phức tạp do bạn đề xuất.'
    ]
  },
  INTP: {
    type: 'INTP',
    title: 'The Thinker / Innovative Logician',
    vietnameseTitle: 'Nhà Tư Duy Logic & Sáng Tạo',
    tagline: 'Đam mê khám phá bản chất công nghệ, tìm tòi thuật toán và giải mã vấn đề hóc búa.',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    strengths: ['Phân tích logic sắc bén', 'Nghiên cứu công nghệ mới nhanh', 'Sáng tạo giải pháp kỹ thuật phi truyền thống', 'Tư duy phản biện'],
    workStyle: 'Thích sự linh hoạt, không gò bó quy trình rườm rà, tập trung giải các bài toán khó.',
    idealTeamRole: 'Core Algorithm Developer, AI/Data Engineer, Security Researcher hoặc Backend Specialist.',
    communicationStyle: 'Chính xác về mặt khái niệm, thích thảo luận sâu về nguyên lý kỹ thuật.',
    growthAreas: ['Cần tập trung vào tính hoàn thiện sản phẩm thay vì chỉ giải bài toán', 'Bám sát deadline thực tế'],
    behavioralQuestions: [
      'Khi gặp một bug hệ thống kỳ lạ chưa từng có trong tài liệu, bạn đã áp dụng quy trình phân tích và dò tìm nguyên nhân gốc rễ (root cause) như thế nào?',
      'Bạn làm thế nào để biến một ý tưởng kỹ thuật đột phá thành một tính năng thực tế phục vụ người dùng?'
    ]
  },
  ENTJ: {
    type: 'ENTJ',
    title: 'The Commander / Strategic Director',
    vietnameseTitle: 'Nhà Điều Hành Quyết Đoán',
    tagline: 'Quyết đoán, định hướng mục tiêu rõ ràng và có năng lực dẫn dắt đội ngũ bứt phá.',
    badgeColor: '#b91c1c',
    badgeBg: '#fef2f2',
    strengths: ['Khả năng dẫn dắt & ra quyết định nhanh', 'Tổ chức luồng công việc khoa học', 'Tối ưu hóa nguồn lực', 'Định hướng kết quả'],
    workStyle: 'Năng động, thúc đẩy tiến độ, đề cao hiệu suất và không ngại đương đầu với thách thức.',
    idealTeamRole: 'Project Manager, Engineering Director, Scrum Master hoặc Product Lead.',
    communicationStyle: 'Thẳng thắn, truyền cảm hứng, hướng đến hành động và kết quả.',
    growthAreas: ['Cần tạo không gian cho thành viên hướng nội chia sẻ', 'Linh hoạt hơn trước các biến số phát sinh'],
    behavioralQuestions: [
      'Khi nhóm gặp xung đột về ưu tiên công việc giữa các bộ phận, bạn đã làm gì để điều phối và giữ đúng tiến độ chung?',
      'Hãy chia sẻ trải nghiệm bạn đã dẫn dắt nhóm vượt qua một giai đoạn áp lực cao nhất.'
    ]
  },
  ENTP: {
    type: 'ENTP',
    title: 'The Visionary / Dynamic Innovator',
    vietnameseTitle: 'Người Tiên Phong Đổi Mới',
    tagline: 'Nhanh nhạy, giàu ý tưởng mới và thích thử nghiệm các công nghệ đột phá.',
    badgeColor: '#ea580c',
    badgeBg: '#fff7ed',
    strengths: ['Khả năng thích ứng siêu tốc', 'Phát kiến ý tưởng mới', 'Tư duy đa chiều', 'Giao tiếp & thuyết trình cuốn hút'],
    workStyle: 'Thích môi trường Agile biến đổi nhanh, ưa thích giai đoạn R&D, Prototype và Brainstorm.',
    idealTeamRole: 'Product Innovator, Solution Architect, Fullstack Prototyper hoặc Growth Engineer.',
    communicationStyle: 'Nhiệt huyết, gợi mở, thích tranh biện mang tính xây dựng.',
    growthAreas: ['Cần duy trì năng lượng vào giai đoạn hoàn thiện chi tiết', 'Tập trung vào các ưu tiên cốt lõi'],
    behavioralQuestions: [
      'Khi một công nghệ/framework mới ra mắt, bạn áp dụng nó vào dự án như thế nào để vừa đổi mới vừa đảm bảo an toàn cho sản phẩm?',
      'Kể về một tình huống bạn đã xoay chuyển giải pháp kỹ thuật khi yêu cầu từ khách hàng thay đổi 180 độ.'
    ]
  },
  INFJ: {
    type: 'INFJ',
    title: 'The Advocate / Insightful Visionary',
    vietnameseTitle: 'Người Cố Vấn Tận Tâm',
    tagline: 'Sâu sắc, thấu hiểu con người và luôn tạo ra sản phẩm mang giá trị tích cực cho người dùng.',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    strengths: ['Thấu cảm người dùng (User Empathy)', 'Tầm nhìn dài hạn', 'Kết nối đội ngũ', 'Tận tụy với sứ mệnh sản phẩm'],
    workStyle: 'Làm việc có mục đích rõ ràng, chú trọng trải nghiệm người dùng và sự hòa hợp của nhóm.',
    idealTeamRole: 'UX Lead, Product Manager (Human-Centric), Tech Mentor hoặc System Specialist.',
    communicationStyle: 'Ấm áp, lắng nghe sâu sắc, thuyết phục thông qua giá trị nhân văn và ý nghĩa dự án.',
    growthAreas: ['Tránh ôm đồm công việc và tự tạo áp lực quá lớn', 'Thẳng thắn hơn khi từ chối yêu cầu không khả thi'],
    behavioralQuestions: [
      'Bạn đã từng làm gì để cải thiện trải nghiệm của người dùng khi nhận được những phản hồi tiêu cực về sản phẩm?',
      'Làm thế nào bạn hỗ trợ một đồng đội đang gặp khó khăn trong công việc mà không làm ảnh hưởng đến tiến độ cá nhân?'
    ]
  },
  INFP: {
    type: 'INFP',
    title: 'The Mediator / Creative Idealist',
    vietnameseTitle: 'Nhà Sáng Tạo Tận Tụy',
    tagline: 'Chân thành, giàu trí tưởng tượng và luôn tìm kiếm sự hoàn hảo trong từng chi tiết sản phẩm.',
    badgeColor: '#0d9488',
    badgeBg: '#f0fdfa',
    strengths: ['Sáng tạo cá nhân hóa', 'Đồng cảm sâu sắc với người dùng', 'Lắng nghe tốt', 'Cống hiến cho công việc'],
    workStyle: 'Thích không gian làm việc yên tĩnh, linh hoạt, được trao quyền tự do sáng tạo.',
    idealTeamRole: 'UI/UX Designer, Frontend Developer, Content/Product Specialist.',
    communicationStyle: 'Nhẹ nhàng, chân thành, tôn trọng sự khác biệt của từng cá nhân.',
    growthAreas: ['Cần tự tin hơn khi trình bày ý tưởng trước tập thể', 'Chấp nhận giải pháp "đủ tốt" để kịp tiến độ'],
    behavioralQuestions: [
      'Khi sản phẩm bạn tâm đắc bị yêu cầu chỉnh sửa nhiều từ khách hàng, bạn đón nhận và phản hồi như thế nào?',
      'Hãy kể về một tính năng bạn đã thiết kế dựa trên sự thấu hiểu sâu sắc nhu cầu của người dùng.'
    ]
  },
  ENFJ: {
    type: 'ENFJ',
    title: 'The Protagonist / Inspiring Mentor',
    vietnameseTitle: 'Người Dẫn Dắt Truyền Cảm Hứng',
    tagline: 'Nhiệt tình, có sức hút tự nhiên và luôn tạo động lực để tập thể cùng phát triển.',
    badgeColor: '#0284c7',
    badgeBg: '#f0f9ff',
    strengths: ['Truyền cảm hứng & gắn kết nhóm', 'Phát triển năng lực đồng đội', 'Giao tiếp xuất sắc', 'Tổ chức sự kiện & cộng đồng'],
    workStyle: 'Hợp tác chặt chẽ, tạo môi trường tích cực, hỗ trợ đồng đội vượt qua khó khăn.',
    idealTeamRole: 'Engineering Manager, Scrum Master, Team Lead hoặc Developer Advocate.',
    communicationStyle: 'Đầy năng lượng, đồng cảm, rõ ràng và biết cách khích lệ tinh thần.',
    growthAreas: ['Cần cân bằng giữa việc giúp đỡ người khác và hoàn thành task cá nhân'],
    behavioralQuestions: [
      'Bạn đã từng xây dựng động lực cho một nhóm đang bị áp lực deadline nặng nề như thế nào?',
      'Khi hai thành viên trong nhóm bất đồng quan điểm, bạn đã đứng ra làm cầu nối giải quyết ra sao?'
    ]
  },
  ENFP: {
    type: 'ENFP',
    title: 'The Campaigner / Creative Catalyst',
    vietnameseTitle: 'Người Khởi Xướng Đầy Năng Lượng',
    tagline: 'Lạc quan, giao thiệp rộng, thích kết nối con người và khai phá những ý tưởng độc đáo.',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    strengths: ['Sáng tạo không giới hạn', 'Kết nối mạng lưới xuất sắc', 'Truyền năng lượng tích cực', 'Thích ứng linh hoạt'],
    workStyle: 'Làm việc theo cảm hứng và sự kết nối, thích các buổi Hackathon, Brainstorming và thử nghiệm mới.',
    idealTeamRole: 'Product Owner, Growth Hacker, Community Lead hoặc Frontend Creative Developer.',
    communicationStyle: 'Hào hứng, cởi mở, sinh động và đầy hình ảnh.',
    growthAreas: ['Cần kỷ luật hơn trong việc duy trì thói quen và quản lý tài liệu chi tiết'],
    behavioralQuestions: [
      'Hãy chia sẻ về một ý tưởng sáng tạo mà bạn đã đề xuất và triển khai thành công cùng nhóm.',
      'Bạn quản lý thời gian như thế nào khi có quá nhiều ý tưởng và cơ hội cùng xuất hiện một lúc?'
    ]
  },
  ISTJ: {
    type: 'ISTJ',
    title: 'The Inspector / Reliable Organizer',
    vietnameseTitle: 'Người Thực Thi Đáng Tin Cậy',
    tagline: 'Cẩn trọng, kỷ luật thép, tôn trọng nguyên tắc và luôn đảm bảo hệ thống vận hành chuẩn xác.',
    badgeColor: '#475569',
    badgeBg: '#f8fafc',
    strengths: ['Độ tin cậy & cam kết 100%', 'Chú ý chi tiết tuyệt đối', 'Quản lý quy trình chuẩn mực', 'Kiểm soát rủi ro'],
    workStyle: 'Quy củ, ngăn nắp, làm việc theo checklist rõ ràng, đề cao tính ổn định và bảo mật.',
    idealTeamRole: 'DevOps / SysAdmin, QA/QC Automation Lead, Database Administrator, Security Compliance.',
    communicationStyle: 'Ngắn gọn, súc tích, dựa trên sự thật và tài liệu quy chuẩn.',
    growthAreas: ['Nên cởi mở hơn với những phương pháp làm việc mới hoặc công nghệ thử nghiệm'],
    behavioralQuestions: [
      'Bạn đã từng phát hiện và ngăn chặn một lỗ hổng hoặc rủi ro nghiêm trọng trong quy trình triển khai như thế nào?',
      'Làm thế nào bạn duy trì độ chính xác và chất lượng công việc khi xử lý khối lượng dữ liệu lớn lặp đi lặp lại?'
    ]
  },
  ISFJ: {
    type: 'ISFJ',
    title: 'The Defender / Dedicated Supporter',
    vietnameseTitle: 'Người Hậu Phương Tận Tụy',
    tagline: 'Chu đáo, tỉ mỉ, luôn âm thầm cống hiến và là điểm tựa vững chắc cho toàn đội ngũ.',
    badgeColor: '#16a34a',
    badgeBg: '#f0fdf4',
    strengths: ['Tỉ mỉ & kiên nhẫn', 'Hỗ trợ đồng đội hết mình', 'Gìn giữ sự ổn định', 'Trách nhiệm cao'],
    workStyle: 'Cẩn thận từng chi tiết, duy trì tài liệu đầy đủ, đảm bảo sản phẩm hoàn thiện không có lỗi vặt.',
    idealTeamRole: 'Quality Assurance Specialist, Customer Success Engineer, Technical Support Lead.',
    communicationStyle: 'Ân cần, rõ ràng, lịch sự và luôn hỗ trợ.',
    growthAreas: ['Cần mạnh dạn đóng góp ý kiến cá nhân trong các cuộc họp lớn'],
    behavioralQuestions: [
      'Hãy chia sẻ một tình huống bạn đã hỗ trợ giải quyết sự cố cho khách hàng hoặc đồng đội ngoài giờ làm việc.',
      'Làm thế nào bạn đảm bảo chất lượng kiểm thử không bị bỏ sót các trường hợp ngoại lệ (edge cases)?'
    ]
  },
  ESTJ: {
    type: 'ESTJ',
    title: 'The Executive / Efficient Organizer',
    vietnameseTitle: 'Nhà Quản Lý Hiệu Quả',
    tagline: 'Thực tế, quyết liệt, giỏi tổ chức nhân sự và tối ưu hóa quy trình làm việc chuẩn mực.',
    badgeColor: '#4f46e5',
    badgeBg: '#eef2ff',
    strengths: ['Kỹ năng tổ chức & quản lý vượt trội', 'Tối ưu hóa quy trình', 'Quyết đoán & trách nhiệm', 'Rõ ràng, minh bạch'],
    workStyle: 'Kỷ luật, bám sát KPI, phân chia công việc minh bạch và theo dõi tiến độ chặt chẽ.',
    idealTeamRole: 'Project Manager, Delivery Manager, Operations Lead hoặc Scrum Master.',
    communicationStyle: 'Rõ ràng, trực diện, tập trung vào nhiệm vụ, thời hạn và trách nhiệm.',
    growthAreas: ['Lắng nghe và khuyến khích những đóng góp mang tính sáng tạo phá cách'],
    behavioralQuestions: [
      'Khi dự án bị chậm tiến độ do sự cố kỹ thuật, bạn đã sắp xếp lại nguồn lực như thế nào để kịp ngày bàn giao?',
      'Bạn đã từng áp dụng phương pháp nào để chuẩn hóa quy trình làm việc cho một nhóm mới thành lập?'
    ]
  },
  ESFJ: {
    type: 'ESFJ',
    title: 'The Provider / Harmonious Facilitator',
    vietnameseTitle: 'Người Kết Nối Hòa Hợp',
    tagline: 'Nhiệt tình, chu đáo, giỏi kết nối các phòng ban và tạo dựng bầu không khí hợp tác thân thiện.',
    badgeColor: '#db2777',
    badgeBg: '#fdf2f8',
    strengths: ['Xây dựng mối quan hệ tốt', 'Điều phối sự phối hợp liên phòng ban', 'Quan tâm đến nhu cầu của nhóm', 'Tận tâm'],
    workStyle: 'Thích làm việc nhóm, giao tiếp trực tiếp, tạo sự gắn kết và giải quyết các vướng mắc giao tiếp.',
    idealTeamRole: 'Scrum Facilitator, HR/Talent Partner, Technical Account Manager.',
    communicationStyle: 'Thân thiện, ấm áp, cởi mở và tạo sự tin tưởng.',
    growthAreas: ['Tách bạch giữa cảm xúc cá nhân và các quyết định công việc khách quan'],
    behavioralQuestions: [
      'Bạn đã từng làm gì để xây dựng sự phối hợp ăn ý giữa nhóm phát triển kỹ thuật và nhóm kinh doanh/marketing?',
      'Khi có mâu thuẫn giao tiếp giữa các thành viên, bạn đã can thiệp như thế nào để tạo lại sự gắn kết?'
    ]
  },
  ISTP: {
    type: 'ISTP',
    title: 'The Virtuoso / Pragmatic Problem Solver',
    vietnameseTitle: 'Nhà Kỹ Thuật Thực Chiến',
    tagline: 'Bình tĩnh, thực tế, phản xạ nhanh trước sự cố và có kỹ năng khắc phục lỗi kỹ thuật xuất sắc.',
    badgeColor: '#0891b2',
    badgeBg: '#ecfeff',
    strengths: ['Xử lý sự cố (Troubleshooting) thần tốc', 'Tư duy thực dụng', 'Thích ứng cao với tình huống khẩn cấp', 'Tối ưu mã nguồn'],
    workStyle: 'Hành động hơn lời nói, đi thẳng vào bản chất kỹ thuật, gỡ lỗi nhanh và hiệu quả.',
    idealTeamRole: 'Site Reliability Engineer (SRE), Embedded/IoT Developer, Backend Troubleshooter.',
    communicationStyle: 'Ngắn gọn, thực tế, chỉ tập trung vào giải pháp đang cần giải quyết.',
    growthAreas: ['Cần chủ động cập nhật tiến độ công việc thường xuyên hơn cho quản lý'],
    behavioralQuestions: [
      'Kể về sự cố server/hệ thống nghiêm trọng nhất bạn từng gặp và cách bạn giữ bình tĩnh để xử lý trong thời gian ngắn nhất.',
      'Khi đối mặt với một đoạn code cũ (legacy) phức tạp, bạn tiếp cận và refactor nó như thế nào?'
    ]
  },
  ISFP: {
    type: 'ISFP',
    title: 'The Adventurer / Flexible Artisan',
    vietnameseTitle: 'Nghệ Sĩ Tinh Tế & Thực Tế',
    tagline: 'Nhạy bén với cái đẹp, linh hoạt, chú trọng trải nghiệm thị giác và sự hài hòa của sản phẩm.',
    badgeColor: '#9333ea',
    badgeBg: '#faf5ff',
    strengths: ['Thẩm mỹ giao diện xuất sắc', 'Nhạy bén với chi tiết tương tác (Micro-interactions)', 'Linh hoạt', 'Hòa nhã'],
    workStyle: 'Làm việc theo mạch cảm xúc và cảm nhận thẩm mỹ, chăm chút cho từng pixel và chuyển động UI.',
    idealTeamRole: 'UI Designer, Motion / Creative Frontend Developer, Visual Designer.',
    communicationStyle: 'Khiêm tốn, nhẹ nhàng, thể hiện bản thân tốt nhất qua sản phẩm trực quan.',
    growthAreas: ['Cần mạnh dạn bảo vệ quan điểm thiết kế trước những đóng góp trái chiều'],
    behavioralQuestions: [
      'Bạn làm thế nào để cân bằng giữa một thiết kế giao diện đẹp mắt, nghệ thuật và tính tiện dụng (usability) cho người dùng?',
      'Hãy chia sẻ một dự án mà bạn đã cải tiến trải nghiệm thị giác và nhận được phản hồi tích cực.'
    ]
  },
  ESTP: {
    type: 'ESTP',
    title: 'The Dynamo / Agile Troubleshooter',
    vietnameseTitle: 'Người Hành Động Quả Cảm',
    tagline: 'Năng động, dám nghĩ dám làm, phản ứng linh hoạt trước biến số và luôn tìm cách giải quyết vấn đề nhanh nhất.',
    badgeColor: '#ca8a04',
    badgeBg: '#fefce8',
    strengths: ['Hành động quyết liệt', 'Đàm phán & thuyết phục tốt', 'Phản xạ tức thời trước cơ hội', 'Thực dụng'],
    workStyle: 'Nhanh nhẹn, ghét sự chậm trễ, thích làm việc trực tiếp trên hiện trường hoặc môi trường nhiều biến động.',
    idealTeamRole: 'DevOps on-call, Sales Engineer, Technical Project Troubleshooter.',
    communicationStyle: 'Sôi nổi, thực tế, dùng hành động và kết quả để chứng minh.',
    growthAreas: ['Cần dành thời gian suy tính đến các hệ quả dài hạn trước khi quyết định'],
    behavioralQuestions: [
      'Khi dự án bất ngờ phát sinh yêu cầu khẩn cấp trong vòng 24 giờ, bạn đã phản ứng và xử lý như thế nào?',
      'Kể về một tình huống bạn phải đưa ra quyết định kỹ thuật quan trọng khi chưa có đủ 100% dữ liệu.'
    ]
  },
  ESFP: {
    type: 'ESFP',
    title: 'The Entertainer / Enthusiastic Collaborator',
    vietnameseTitle: 'Người Truyền Cảm Hứng Tràn Đầy Năng Lượng',
    tagline: 'Hòa đồng, sáng tạo, làm việc với niềm vui và luôn thắp sáng bầu không khí làm việc của tập thể.',
    badgeColor: '#e11d48',
    badgeBg: '#fff1f2',
    strengths: ['Khuấy động tinh thần nhóm', 'Giao tiếp cộng đồng xuất sắc', 'Linh hoạt & sáng tạo ứng biến', 'Đồng cảm'],
    workStyle: 'Thích môi trường làm việc cởi mở, tương tác liên tục, trình bày demo sản phẩm trực quan.',
    idealTeamRole: 'Developer Relations (DevRel), Frontend UI Developer, Technical Community Manager.',
    communicationStyle: 'Hài hước, tự nhiên, truyền cảm xúc tích cực và thu hút sự chú ý.',
    growthAreas: ['Cần kiên nhẫn hơn với các tài liệu kỹ thuật dài và các quy trình mang tính thủ tục'],
    behavioralQuestions: [
      'Bạn đã từng thuyết trình hoặc demo sản phẩm kỹ thuật trước một đám đông lớn như thế nào?',
      'Làm thế nào bạn duy trì tinh thần làm việc tích cực và lan tỏa nó đến các thành viên trong nhóm?'
    ]
  },
};

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // Trục 1: Extraversion (E) vs Introversion (I)
  {
    id: 1,
    dimension: 'EI',
    question: 'Sau một tuần học tập và làm việc căng thẳng, bạn nạp lại năng lượng bằng cách nào?',
    optionA: { text: 'Gặp gỡ bạn bè, tham gia các buổi giao lưu, sự kiện hoặc hoạt động đông người.', value: 'E' },
    optionB: { text: 'Dành thời gian một mình đọc sách, xem phim, nghe nhạc hoặc làm dự án cá nhân yên tĩnh.', value: 'I' },
  },
  {
    id: 2,
    dimension: 'EI',
    question: 'Khi bắt đầu một đồ án hoặc công việc mới trong nhóm, bạn thường:',
    optionA: { text: 'Chủ động bắt chuyện, thảo luận sôi nổi và thảo luận trực tiếp với mọi người.', value: 'E' },
    optionB: { text: 'Quan sát, lắng nghe trước và suy nghĩ kỹ trong đầu trước khi phát biểu ý kiến.', value: 'I' },
  },
  {
    id: 3,
    dimension: 'EI',
    question: 'Trong môi trường làm việc, bạn cảm thấy thoải mái nhất khi:',
    optionA: { text: 'Không gian mở, nhiều tương tác và có thể trao đổi ý tưởng tức thời với đồng nghiệp.', value: 'E' },
    optionB: { text: 'Không gian yên tĩnh, ít bị gián đoạn để có thể tập trung tư duy sâu (Deep Work).', value: 'I' },
  },
  {
    id: 4,
    dimension: 'EI',
    question: 'Cách bạn xử lý khi nảy ra một ý tưởng kỹ thuật mới:',
    optionA: { text: 'Nói ra ngay để cùng thảo luận và hoàn thiện ý tưởng qua quá trình trò chuyện.', value: 'E' },
    optionB: { text: 'Tự mình nghiên cứu, thử nghiệm nháp và cân nhắc kỹ lưỡng trước khi chia sẻ.', value: 'I' },
  },

  // Trục 2: Sensing (S) vs Intuition (N)
  {
    id: 5,
    dimension: 'SN',
    question: 'Khi tiếp cận một bài toán hoặc công nghệ mới, bạn có xu hướng:',
    optionA: { text: 'Tập trung vào các ví dụ thực tế, dữ liệu cụ thể và các bước hướng dẫn rõ ràng từng bước.', value: 'S' },
    optionB: { text: 'Tìm hiểu bức tranh tổng thể, các mô hình lý thuyết và tiềm năng ứng dụng trong tương lai.', value: 'N' },
  },
  {
    id: 6,
    dimension: 'SN',
    question: 'Bạn thường tự tin nhất khi làm việc với:',
    optionA: { text: 'Sự thật (Facts), dữ liệu đã được kiểm chứng và những phương pháp đã chứng minh hiệu quả.', value: 'S' },
    optionB: { text: 'Ý tưởng mới, khả năng tiềm ẩn và các giải pháp mang tính đột phá chưa ai làm.', value: 'N' },
  },
  {
    id: 7,
    dimension: 'SN',
    question: 'Khi đọc một tài liệu kỹ thuật hoặc mô tả dự án, bạn chú ý trước tiên đến:',
    optionA: { text: 'Các chi tiết cụ thể, thông số kỹ thuật, cấu hình và danh sách yêu cầu rõ ràng.', value: 'S' },
    optionB: { text: 'Mục đích cốt lõi, kiến trúc tổng quan và hướng đi chiến lược của hệ thống.', value: 'N' },
  },
  {
    id: 8,
    dimension: 'SN',
    question: 'Mọi người xung quanh thường nhận xét bạn là người:',
    optionA: { text: 'Thực tế, chi tiết, tỉ mỉ và luôn bám sát hiện thực.', value: 'S' },
    optionB: { text: 'Giàu trí tưởng tượng, thích tư duy trừu tượng và có tầm nhìn xa.', value: 'N' },
  },

  // Trục 3: Thinking (T) vs Feeling (F)
  {
    id: 9,
    dimension: 'TF',
    question: 'Khi đứng trước một quyết định kỹ thuật quan trọng trong dự án, tiêu chí hàng đầu của bạn là:',
    optionA: { text: 'Logic khách quan, hiệu năng, tính tối ưu và dữ liệu đo lường chính xác.', value: 'T' },
    optionB: { text: 'Sự đồng thuận của nhóm, trải nghiệm con người và tác động đến các bên liên quan.', value: 'F' },
  },
  {
    id: 10,
    dimension: 'TF',
    question: 'Khi review code hoặc đánh giá bài tập của đồng đội, bạn thường:',
    optionA: { text: 'Chỉ ra trực tiếp các lỗi sai logic và tiêu chuẩn kỹ thuật cần sửa đổi một cách thẳng thắn.', value: 'T' },
    optionB: { text: 'Góp ý nhẹ nhàng, bắt đầu bằng lời khen ngợi nỗ lực trước khi khéo léo đề xuất cải thiện.', value: 'F' },
  },
  {
    id: 11,
    dimension: 'TF',
    question: 'Khi xảy ra bất đồng ý kiến trong nhóm, điều bạn ưu tiên nhất là:',
    optionA: { text: 'Tìm ra giải pháp đúng đắn nhất về mặt kỹ thuật, bất kể ai là người đưa ra ý tưởng.', value: 'T' },
    optionB: { text: 'Giữ hòa khí trong nhóm, đảm bảo mọi người đều cảm thấy được lắng nghe và tôn trọng.', value: 'F' },
  },
  {
    id: 12,
    dimension: 'TF',
    question: 'Bạn cảm thấy tự hào hơn khi được khen ngợi là người:',
    optionA: { text: 'Có năng lực tư duy logic sắc bén, công bằng và sáng suốt.', value: 'T' },
    optionB: { text: 'Là người biết quan tâm, thấu hiểu, ấm áp và luôn sẵn lòng giúp đỡ người khác.', value: 'F' },
  },

  // Trục 4: Judging (J) vs Perceiving (P)
  {
    id: 13,
    dimension: 'JP',
    question: 'Cách bạn quản lý thời gian và tiến độ làm việc thường là:',
    optionA: { text: 'Lập kế hoạch chi tiết, có checklist rõ ràng và hoàn thành sớm trước hạn chót (deadline).', value: 'J' },
    optionB: { text: 'Linh hoạt tùy theo cảm hứng, thích ứng theo tình hình và bứt phá mạnh mẽ ở giai đoạn nước rút.', value: 'P' },
  },
  {
    id: 14,
    dimension: 'JP',
    question: 'Khi bắt tay vào làm một tính năng phần mềm lớn, bạn thích:',
    optionA: { text: 'Có tài liệu thiết kế (Spec) rõ ràng, cấu trúc database cố định trước khi bắt đầu code.', value: 'J' },
    optionB: { text: 'Bắt đầu thử nghiệm nhanh bằng Prototype và vừa làm vừa chỉnh sửa linh hoạt.', value: 'P' },
  },
  {
    id: 15,
    dimension: 'JP',
    question: 'Bàn làm việc hoặc không gian máy tính của bạn thường:',
    optionA: { text: 'Gọn gàng, các thư mục file được phân chia ngăn nắp theo cấu trúc rõ ràng.', value: 'J' },
    optionB: { text: 'Khá phóng khoáng, nhiều tab trình duyệt mở cùng lúc nhưng bạn vẫn biết mọi thứ ở đâu.', value: 'P' },
  },
  {
    id: 16,
    dimension: 'JP',
    question: 'Bạn cảm thấy thoải mái hơn khi:',
    optionA: { text: 'Mọi thứ đã được quyết định dứt điểm và có kế hoạch cụ thể cho tương lai.', value: 'J' },
    optionB: { text: 'Các lựa chọn vẫn còn mở để có thể thay đổi tùy biến theo tình huống mới.', value: 'P' },
  },
];

export const MBTI_STORAGE_KEY = 'profilehub_student_mbti_result';

export function calculateMBTI(answers: Record<number, 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'>): CandidateMBTIResult {
  let countE = 0, countI = 0;
  let countS = 0, countN = 0;
  let countT = 0, countF = 0;
  let countJ = 0, countP = 0;

  for (const q of MBTI_QUESTIONS) {
    const ans = answers[q.id];
    if (ans === 'E') countE++;
    else if (ans === 'I') countI++;
    else if (ans === 'S') countS++;
    else if (ans === 'N') countN++;
    else if (ans === 'T') countT++;
    else if (ans === 'F') countF++;
    else if (ans === 'J') countJ++;
    else if (ans === 'P') countP++;
  }

  const totalEI = Math.max(1, countE + countI);
  const totalSN = Math.max(1, countS + countN);
  const totalTF = Math.max(1, countT + countF);
  const totalJP = Math.max(1, countJ + countP);

  const extraversion = Math.round((countE / totalEI) * 100);
  const sensing = Math.round((countS / totalSN) * 100);
  const thinking = Math.round((countT / totalTF) * 100);
  const judging = Math.round((countJ / totalJP) * 100);

  const dimE = countE >= countI ? 'E' : 'I';
  const dimS = countS >= countN ? 'S' : 'N';
  const dimT = countT >= countF ? 'T' : 'F';
  const dimJ = countJ >= countP ? 'J' : 'P';

  const mbtiType = `${dimE}${dimS}${dimT}${dimJ}` as MBTIType;
  const dimensions: MBTIDimensions = {
    extraversion,
    introversion: 100 - extraversion,
    sensing,
    intuition: 100 - sensing,
    thinking,
    feeling: 100 - thinking,
    judging,
    perceiving: 100 - judging,
  };

  const profile = MBTI_PROFILES[mbtiType] || MBTI_PROFILES.INTJ;

  return {
    mbtiType,
    dimensions,
    testedAt: new Date().toISOString(),
    profile,
  };
}

export interface MBTIJobCompatibility {
  culturalFitScore: number;
  roleAlignmentRating: 'PERFECT_ROLE_FIT' | 'STRONG_CULTURAL_FIT' | 'BALANCED_FIT' | 'COMPLEMENTARY_FIT';
  roleAlignmentTitle: string;
  culturalStrengths: string[];
  workplaceSynergy: string;
  suggestedProbes: string[];
}

/**
 * Calculates MBTI Cultural & Workplace Compatibility against a specific Job Role
 */
export function calculateMBTIJobCompatibility(
  mbtiType: MBTIType,
  jobTitle: string,
  jobRequirements: string[] = []
): MBTIJobCompatibility {
  const title = (jobTitle || '').toLowerCase();
  const reqsText = jobRequirements.join(' ').toLowerCase();
  const profile = MBTI_PROFILES[mbtiType] || MBTI_PROFILES.INTJ;

  let baseScore = 80;
  let roleAlignmentTitle = 'Phù Hợp Bổ Trợ Cho Đội Ngũ';
  let roleAlignmentRating: MBTIJobCompatibility['roleAlignmentRating'] = 'BALANCED_FIT';
  const culturalStrengths: string[] = [];
  let workplaceSynergy = 'Mang lại góc nhìn đa dạng và phong cách làm việc cân bằng.';

  // Design / Frontend / UX Focus
  if (title.includes('ui/ux') || title.includes('design') || title.includes('frontend') || reqsText.includes('figma') || reqsText.includes('ux')) {
    if (['ENFP', 'INFP', 'INFJ', 'ISFP'].includes(mbtiType)) {
      baseScore = 95;
      roleAlignmentTitle = 'Tương Thích Xuất Sắc Với Trải Nghiệm Người Dùng (UX)';
      roleAlignmentRating = 'PERFECT_ROLE_FIT';
      culturalStrengths.push('Trực giác thẩm mỹ sắc bén & thấu cảm người dùng (User Empathy)');
      culturalStrengths.push('Sáng tạo giao diện tinh tế, chú trọng chi tiết trải nghiệm');
      workplaceSynergy = 'Đóng vai trò cầu nối cảm xúc giữa người dùng và sản phẩm công nghệ.';
    } else if (['INTJ', 'INTP', 'ENTP'].includes(mbtiType)) {
      baseScore = 90;
      roleAlignmentTitle = 'Tư Duy Kiến Trúc Giao Diện & Design System';
      roleAlignmentRating = 'STRONG_CULTURAL_FIT';
      culturalStrengths.push('Tư duy module hóa Design System và tái sử dụng component');
      culturalStrengths.push('Tối ưu hóa luồng tương tác và logic hiển thị phức tạp');
      workplaceSynergy = 'Giúp chuẩn hóa và mở rộng kiến trúc Frontend/UI bài bản.';
    } else {
      baseScore = 83;
      roleAlignmentRating = 'BALANCED_FIT';
      culturalStrengths.push('Thực thi giao diện đúng đặc tả kỹ thuật và pixel-perfect');
      culturalStrengths.push('Tuân thủ nghiêm ngặt chuẩn design tokens');
    }
  }
  // Backend / Cloud / Data / Core Architecture Focus
  else if (title.includes('backend') || title.includes('data') || title.includes('ai') || title.includes('cloud') || title.includes('system') || title.includes('devops') || title.includes('security')) {
    if (['INTJ', 'INTP', 'ISTJ', 'ISTP'].includes(mbtiType)) {
      baseScore = 96;
      roleAlignmentTitle = 'Thiên Hướng Kỹ Thuật Chuyên Sâu & Tư Duy Thuật Toán';
      roleAlignmentRating = 'PERFECT_ROLE_FIT';
      culturalStrengths.push('Tư duy giải thuật và kiến trúc dữ liệu logic, chặt chẽ');
      culturalStrengths.push('Khả năng cô lập nguyên nhân gốc rễ và debug độc lập xuất sắc');
      workplaceSynergy = 'Trụ cột vững chắc cho các hệ thống yêu cầu độ tin cậy và hiệu năng cao.';
    } else if (['ENTJ', 'ENTP'].includes(mbtiType)) {
      baseScore = 91;
      roleAlignmentTitle = 'Tư Duy Tối Ưu Quy Trình & Kiến Trúc Mở Rộng';
      roleAlignmentRating = 'STRONG_CULTURAL_FIT';
      culturalStrengths.push('Chủ động cải tiến công nghệ và áp dụng best practices');
      culturalStrengths.push('Tối ưu hóa pipeline CI/CD và luồng dữ liệu liên bộ phận');
      workplaceSynergy = 'Tạo động lực cải tiến kỹ thuật liên tục cho toàn đội ngũ backend.';
    } else {
      baseScore = 84;
      roleAlignmentRating = 'BALANCED_FIT';
      culturalStrengths.push('Làm việc cẩn trọng, bám sát tài liệu API và bảo mật');
      culturalStrengths.push('Hợp tác mượt mà trong các sprint Scrum/Agile');
    }
  }
  // Leadership / Management / Product
  else if (title.includes('lead') || title.includes('manager') || title.includes('product') || title.includes('scrum')) {
    if (['ENTJ', 'ENFJ', 'ESTJ', 'ENTP'].includes(mbtiType)) {
      baseScore = 96;
      roleAlignmentTitle = 'Tố Chất Dẫn Dắt & Điều Phối Đội Ngũ Toàn Diện';
      roleAlignmentRating = 'PERFECT_ROLE_FIT';
      culturalStrengths.push('Khả năng thúc đẩy tiến độ và giải quyết xung đột nhanh');
      culturalStrengths.push('Giao tiếp truyền cảm hứng và định hướng mục tiêu rõ ràng');
      workplaceSynergy = 'Giữ nhịp độ dự án ổn định và tạo môi trường làm việc nhiều động lực.';
    } else {
      baseScore = 85;
      roleAlignmentRating = 'STRONG_CULTURAL_FIT';
      culturalStrengths.push('Quản lý công việc có kế hoạch, tỉ mỉ và trách nhiệm');
    }
  }
  // General Software / Fullstack
  else {
    if (['INTJ', 'INTP', 'ENTP', 'ISTP', 'ISTJ'].includes(mbtiType)) {
      baseScore = 92;
      roleAlignmentTitle = 'Linh Hoạt Toàn Diện & Giải Quyết Vấn Đề Nhanh';
      roleAlignmentRating = 'STRONG_CULTURAL_FIT';
      culturalStrengths.push('Thích ứng nhanh với full tech stack từ giao diện tới database');
      culturalStrengths.push('Tư duy phản biện và tối ưu hóa hiệu năng tổng thể');
      workplaceSynergy = 'Sẵn sàng tiếp nhận các bài toán đa ngành và độc lập triển khai.';
    } else {
      baseScore = 85;
      roleAlignmentRating = 'BALANCED_FIT';
      culturalStrengths.push('Hòa đồng, giao tiếp tốt và hỗ trợ đồng đội tích cực');
      culturalStrengths.push('Tập trung hoàn thành mục tiêu chung của sprint');
    }
  }

  // Add default strengths if fewer than 2
  if (culturalStrengths.length < 2) {
    culturalStrengths.push(...profile.strengths.slice(0, 2));
  }

  return {
    culturalFitScore: baseScore,
    roleAlignmentRating,
    roleAlignmentTitle,
    culturalStrengths,
    workplaceSynergy,
    suggestedProbes: profile.behavioralQuestions,
  };
}

export function saveCandidateMBTI(result: CandidateMBTIResult): void {
  try {
    localStorage.setItem(MBTI_STORAGE_KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('Failed to save MBTI to localStorage:', e);
  }
}

export function getCandidateMBTI(): CandidateMBTIResult | null {
  try {
    const raw = localStorage.getItem(MBTI_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CandidateMBTIResult;
  } catch {
    return null;
  }
}

export function getMockMBTIForCandidate(candidateId?: string): CandidateMBTIResult {
  // Deterministic mock based on candidateId
  const types: MBTIType[] = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'ENFP', 'ISTJ', 'ISTP'];
  const hash = (candidateId || 'default').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const chosenType = types[hash % types.length];
  const profile = MBTI_PROFILES[chosenType];

  return {
    mbtiType: chosenType,
    dimensions: {
      extraversion: chosenType.startsWith('E') ? 75 : 25,
      introversion: chosenType.startsWith('E') ? 25 : 75,
      sensing: chosenType.includes('S') ? 70 : 30,
      intuition: chosenType.includes('S') ? 30 : 70,
      thinking: chosenType.includes('T') ? 80 : 20,
      feeling: chosenType.includes('T') ? 20 : 80,
      judging: chosenType.endsWith('J') ? 75 : 25,
      perceiving: chosenType.endsWith('J') ? 25 : 75,
    },
    testedAt: new Date().toISOString(),
    profile,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 🎯 DUAL-MBTI MATCHING: CANDIDATE MBTI ⟷ JOB / ROLE IDEAL PERSONA (MÔ HÌNH 2)
 * ────────────────────────────────────────────────────────────────────────────*/

export const ROLE_MBTI_PRESETS: Record<string, RoleMBTIPersona> = {
  frontend: {
    roleKey: 'frontend',
    roleTitle: 'Frontend Engineer / React Developer',
    roleArchetype: 'Creative UI Crafter & Empathic User-Centric Builder',
    roleArchetypeVi: 'Nghệ Nhân Giao Diện & Thấu Cảm Người Dùng',
    primaryIdealType: 'INFP',
    idealTypes: ['INFP', 'ISFP', 'ENFP', 'INTP'],
    keyTraitsNeeded: ['Thấu cảm người dùng (User Empathy)', 'Tỉ mỉ thẩm mỹ giao diện', 'Linh hoạt tương tác nhóm Design & Product', 'Tư duy Component kiến trúc'],
    targetDimensions: {
      extraversionScore: 40, // Cần vừa tập trung code vừa giao tiếp với designer/backend
      intuitionScore: 65,    // Cần trực giác thẩm mỹ và tưởng tượng flow trải nghiệm
      thinkingScore: 50,     // Cân bằng giữa logic thuật toán và trải nghiệm cảm xúc
      judgingScore: 45,      // Linh hoạt đáp ứng thay đổi UI/UX liên tục
    },
    workEnvironmentDescription: 'Môi trường làm việc đa chức năng, phối hợp chặt chẽ giữa UI/UX Designer, Product Owner và Backend Team. Đòi hỏi độ nhạy thẩm mỹ cao.',
  },
  backend: {
    roleKey: 'backend',
    roleTitle: 'Backend / Systems / Cloud Architect',
    roleArchetype: 'Strategic System Architect & Deep Algorithmic Thinker',
    roleArchetypeVi: 'Kiến Trúc Sư Hệ Thống & Chuyên Gia Thuật Toán',
    primaryIdealType: 'INTJ',
    idealTypes: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    keyTraitsNeeded: ['Tư duy kiến trúc hệ thống và dữ liệu', 'Tập trung sâu & giải quyết vấn đề độc lập', 'Tiêu chuẩn chịu tải và an toàn cao', 'Logic kiên định'],
    targetDimensions: {
      extraversionScore: 25, // Ưu tiên tập trung sâu, làm việc độc lập với hệ thống lớn
      intuitionScore: 75,    // Tầm nhìn kiến trúc tổng thể, mô hình hóa dữ liệu phức tạp
      thinkingScore: 90,     // Ra quyết định dựa trên số liệu hiệu năng, độ trễ và logic
      judgingScore: 80,      // Quy chuẩn bài bản, kiểm soát chặt chẽ schema và migration
    },
    workEnvironmentDescription: 'Hệ thống hạ tầng dịch vụ trọng yếu, đòi hỏi độ tin cậy cao, kiến trúc dữ liệu chặt chẽ và khả năng cô lập lỗi hệ thống.',
  },
  fullstack: {
    roleKey: 'fullstack',
    roleTitle: 'Fullstack Software Engineer',
    roleArchetype: 'Versatile Prototyper & End-to-End Problem Solver',
    roleArchetypeVi: 'Kỹ Sư Đa Năng & Nhà Đổi Mới Toàn Diện',
    primaryIdealType: 'INTP',
    idealTypes: ['INTP', 'ENTP', 'INTJ', 'ISTP'],
    keyTraitsNeeded: ['Thích ứng siêu tốc với đa công nghệ', 'Khả năng kết nối từ Database tới UI', 'Tư duy phản biện', 'Tự chủ triển khai MVP'],
    targetDimensions: {
      extraversionScore: 45,
      intuitionScore: 70,
      thinkingScore: 75,
      judgingScore: 50,
    },
    workEnvironmentDescription: 'Nhịp độ phát triển Agile nhanh, cần tự chủ giải quyết trọn vẹn từ ý tưởng đến sản phẩm hoàn chỉnh.',
  },
  product_manager: {
    roleKey: 'product_manager',
    roleTitle: 'Product Manager / Product Lead',
    roleArchetype: 'Strategic Director & High-Impact Facilitator',
    roleArchetypeVi: 'Nhà Điều Hành Chiến Lược & Định Hướng Sản Phẩm',
    primaryIdealType: 'ENTJ',
    idealTypes: ['ENTJ', 'ENTP', 'ENFJ', 'ESTJ'],
    keyTraitsNeeded: ['Dẫn dắt & ra quyết định mục tiêu rõ ràng', 'Truyền cảm hứng & kết nối đa phòng ban', 'Tư duy kinh doanh & thị trường', 'Định hướng kết quả'],
    targetDimensions: {
      extraversionScore: 85, // Cần giao tiếp liên tục với khách hàng, sếp và đội kỹ thuật
      intuitionScore: 80,    // Nhìn xa trông rộng, phát hiện cơ hội thị trường
      thinkingScore: 70,     // Cân đối chiến lược kinh doanh và bài toán chi phí
      judgingScore: 75,      // Quản lý roadmap chặt chẽ, chốt deadline
    },
    workEnvironmentDescription: 'Vai trò đầu tàu điều phối, chịu trách nhiệm về thành bại của sản phẩm, đối mặt với nhiều luồng ý kiến từ các bên liên quan.',
  },
  ui_ux: {
    roleKey: 'ui_ux',
    roleTitle: 'UI/UX Designer / Product Designer',
    roleArchetype: 'Human-Centric Visionary & Empathic Experience Designer',
    roleArchetypeVi: 'Nhà Thiết Kế Trải Nghiệm & Thấu Cảm Con Người',
    primaryIdealType: 'INFJ',
    idealTypes: ['INFJ', 'INFP', 'ENFP', 'ISFP'],
    keyTraitsNeeded: ['Thấu cảm người dùng sâu sắc', 'Tư duy Design Thinking', 'Lắng nghe phản hồi không định kiến', 'Trực giác thẩm mỹ tinh tế'],
    targetDimensions: {
      extraversionScore: 45,
      intuitionScore: 85,
      thinkingScore: 30, // Đặt cảm xúc và trải nghiệm người dùng lên hàng đầu
      judgingScore: 60,
    },
    workEnvironmentDescription: 'Không gian sáng tạo, liên tục khảo sát người dùng, phác thảo wireframe và thử nghiệm usability testing.',
  },
  devops_cloud: {
    roleKey: 'devops_cloud',
    roleTitle: 'DevOps / Cloud Platform / SRE Engineer',
    roleArchetype: 'Reliable Infrastructure Guardian & Automation Master',
    roleArchetypeVi: 'Người Bảo Vệ Hạ Tầng & Tự Động Hóa Hệ Thống',
    primaryIdealType: 'ISTJ',
    idealTypes: ['ISTJ', 'INTJ', 'ISTP', 'ESTJ'],
    keyTraitsNeeded: ['Kỷ luật và tỉ mỉ tuyệt đối trong bảo mật', 'Bình tĩnh ứng phó sự cố khẩn cấp', 'Tự động hóa quy trình CI/CD', 'Kiên nhẫn điều tra log'],
    targetDimensions: {
      extraversionScore: 30,
      intuitionScore: 40, // Bám sát thực tế, log cụ thể thay vì lý thuyết viển vông
      thinkingScore: 85,
      judgingScore: 90, // Quy chuẩn nghiêm ngặt, bám sát checklist an ninh
    },
    workEnvironmentDescription: 'Chịu trách nhiệm trực tiếp về uptime 99.99%, trực ca và bảo đảm an toàn dữ liệu trên môi trường Production.',
  },
  data_ai: {
    roleKey: 'data_ai',
    roleTitle: 'AI / Machine Learning / Data Scientist',
    roleArchetype: 'Scientific Explorer & Complex Model Experimenter',
    roleArchetypeVi: 'Nhà Khoa Học Dữ Liệu & Thử Nghiệm Mô Hình Trí Tuệ Nhân Tạo',
    primaryIdealType: 'INTP',
    idealTypes: ['INTP', 'INTJ', 'ISTP', 'ENTP'],
    keyTraitsNeeded: ['Đam mê thuật toán và mô hình thống kê', 'Kiên trì thử nghiệm giả thuyết', 'Tư duy logic trừu tượng', 'Tự học công nghệ mới nhanh'],
    targetDimensions: {
      extraversionScore: 25,
      intuitionScore: 85,
      thinkingScore: 90,
      judgingScore: 40, // Cần sự linh hoạt để thử nghiệm nhiều model khác nhau
    },
    workEnvironmentDescription: 'Môi trường R&D khám phá, phân tích dữ liệu lớn, huấn luyện mô hình và đo lường chỉ số benchmark liên tục.',
  },
  qa_qc: {
    roleKey: 'qa_qc',
    roleTitle: 'QA / QC / Automation Test Engineer',
    roleArchetype: 'Meticulous Quality Inspector & Edge-Case Detective',
    roleArchetypeVi: 'Chuyên Gia Kiểm Định Chất Lượng & Dò Tìm Lỗ Hổng',
    primaryIdealType: 'ISTJ',
    idealTypes: ['ISTJ', 'ISFJ', 'INTJ', 'ISTP'],
    keyTraitsNeeded: ['Tỉ mỉ đến từng chi tiết nhỏ', 'Kiểm chứng mọi giả định trước khi release', 'Tư duy biên kịch kiểm thử (Test Matrix)', 'Tính kỷ luật cao'],
    targetDimensions: {
      extraversionScore: 35,
      intuitionScore: 30, // Bám sát test case thực tế và đặc tả kỹ thuật
      thinkingScore: 80,
      judgingScore: 95, // Đề cao quy trình kiểm thử nghiêm ngặt
    },
    workEnvironmentDescription: 'Chốt chặn chất lượng cuối cùng trước khi sản phẩm đến tay khách hàng, đòi hỏi sự kiên nhẫn và tính chuẩn xác.',
  },
  mobile_dev: {
    roleKey: 'mobile_dev',
    roleTitle: 'Mobile App Developer (iOS / Android / Flutter)',
    roleArchetype: 'Pragmatic Application Crafter & Device-Native Specialist',
    roleArchetypeVi: 'Chuyên Gia Phát Triển Ứng Dụng Di Động & Tối Ưu Thiết Bị',
    primaryIdealType: 'ISTP',
    idealTypes: ['ISTP', 'INTP', 'ISFP', 'INFP'],
    keyTraitsNeeded: ['Tối ưu hóa hiệu năng và pin trên thiết bị', 'Thực tế, thích làm ra sản phẩm chạm được', 'Giải quyết lỗi tương thích OS', 'Linh hoạt sửa lỗi nhanh'],
    targetDimensions: {
      extraversionScore: 40,
      intuitionScore: 50,
      thinkingScore: 70,
      judgingScore: 45,
    },
    workEnvironmentDescription: 'Môi trường phát triển ứng dụng di động người dùng cuối, chú trọng độ mượt mà 60fps và trải nghiệm vuốt chạm.',
  },
  tech_lead: {
    roleKey: 'tech_lead',
    roleTitle: 'Tech Lead / Engineering Manager',
    roleArchetype: 'Inspiring Technical Captain & Team Growth Catalyst',
    roleArchetypeVi: 'Thủ Lĩnh Kỹ Thuật & Người Truyền Động Lực',
    primaryIdealType: 'ENTJ',
    idealTypes: ['ENTJ', 'ENFJ', 'ENTP', 'INTJ'],
    keyTraitsNeeded: ['Cân bằng giữa kỹ thuật cao cấp và con người', 'Đào tạo & Mentoring đội ngũ', 'Giải quyết xung đột kỹ thuật', 'Quyết đoán khi bế tắc'],
    targetDimensions: {
      extraversionScore: 75,
      intuitionScore: 80,
      thinkingScore: 75,
      judgingScore: 80,
    },
    workEnvironmentDescription: 'Lãnh đạo kỹ thuật, bảo đảm năng suất và sự tiến bộ chuyên môn cho cả đội ngũ phát triển.',
  },
};

export function getAllRoleMBTIPresets(): RoleMBTIPersona[] {
  return Object.values(ROLE_MBTI_PRESETS);
}

export function detectIdealMBTIForJob(jobTitle?: string, rawJdText?: string): RoleMBTIPersona {
  const corpus = `${jobTitle || ''} ${rawJdText || ''}`.toLowerCase();

  if (corpus.includes('lead') || corpus.includes('manager') || corpus.includes('quản lý') || corpus.includes('trưởng nhóm') || corpus.includes('head of')) {
    return corpus.includes('product') ? ROLE_MBTI_PRESETS.product_manager : ROLE_MBTI_PRESETS.tech_lead;
  }
  if (corpus.includes('frontend') || corpus.includes('react') || corpus.includes('next.js') || corpus.includes('vue') || corpus.includes('angular') || corpus.includes('giao diện')) {
    return ROLE_MBTI_PRESETS.frontend;
  }
  if (corpus.includes('backend') || corpus.includes('node') || corpus.includes('spring') || corpus.includes('golang') || corpus.includes('c#') || corpus.includes('microservice') || corpus.includes('database')) {
    return ROLE_MBTI_PRESETS.backend;
  }
  if (corpus.includes('fullstack') || corpus.includes('full-stack') || corpus.includes('toàn diện')) {
    return ROLE_MBTI_PRESETS.fullstack;
  }
  if (corpus.includes('devops') || corpus.includes('cloud') || corpus.includes('aws') || corpus.includes('kubernetes') || corpus.includes('sre') || corpus.includes('hạ tầng')) {
    return ROLE_MBTI_PRESETS.devops_cloud;
  }
  if (corpus.includes('ai') || corpus.includes('machine learning') || corpus.includes('data') || corpus.includes('trí tuệ nhân tạo') || corpus.includes('deep learning')) {
    return ROLE_MBTI_PRESETS.data_ai;
  }
  if (corpus.includes('designer') || corpus.includes('ui/ux') || corpus.includes('ux') || corpus.includes('figma') || corpus.includes('thiết kế')) {
    return ROLE_MBTI_PRESETS.ui_ux;
  }
  if (corpus.includes('qa') || corpus.includes('qc') || corpus.includes('test') || corpus.includes('kiểm thử') || corpus.includes('automation')) {
    return ROLE_MBTI_PRESETS.qa_qc;
  }
  if (corpus.includes('mobile') || corpus.includes('flutter') || corpus.includes('android') || corpus.includes('ios') || corpus.includes('react native')) {
    return ROLE_MBTI_PRESETS.mobile_dev;
  }

  return ROLE_MBTI_PRESETS.fullstack;
}

export function calculateDualMBTIJobFit(
  candidateData: CandidateMBTIResult | MBTIType | string,
  jobTitle?: string,
  rawJdText?: string,
  explicitRoleKeyOrType?: string | MBTIType
): DualMBTIMatchAnalysis {
  // 1. Resolve Candidate MBTI Result
  let candidateMBTI: CandidateMBTIResult;
  if (typeof candidateData === 'object' && candidateData !== null && 'mbtiType' in candidateData) {
    candidateMBTI = candidateData as CandidateMBTIResult;
  } else if (typeof candidateData === 'string' && MBTI_PROFILES[candidateData as MBTIType]) {
    const cType = candidateData as MBTIType;
    candidateMBTI = {
      mbtiType: cType,
      dimensions: {
        extraversion: cType.startsWith('E') ? 75 : 25,
        introversion: cType.startsWith('E') ? 25 : 75,
        sensing: cType.includes('S') ? 70 : 30,
        intuition: cType.includes('S') ? 30 : 70,
        thinking: cType.includes('T') ? 80 : 20,
        feeling: cType.includes('T') ? 20 : 80,
        judging: cType.endsWith('J') ? 75 : 25,
        perceiving: cType.endsWith('J') ? 25 : 75,
      },
      testedAt: new Date().toISOString(),
      profile: MBTI_PROFILES[cType],
    };
  } else {
    candidateMBTI = getMockMBTIForCandidate(typeof candidateData === 'string' ? candidateData : 'default');
  }

  // 2. Resolve Role MBTI Persona
  let rolePersona: RoleMBTIPersona;
  if (explicitRoleKeyOrType && ROLE_MBTI_PRESETS[explicitRoleKeyOrType]) {
    rolePersona = ROLE_MBTI_PRESETS[explicitRoleKeyOrType];
  } else if (explicitRoleKeyOrType && MBTI_PROFILES[explicitRoleKeyOrType as MBTIType]) {
    const idealType = explicitRoleKeyOrType as MBTIType;
    const foundPreset = Object.values(ROLE_MBTI_PRESETS).find(p => p.primaryIdealType === idealType);
    if (foundPreset) {
      rolePersona = foundPreset;
    } else {
      rolePersona = {
        roleKey: 'custom',
        roleTitle: jobTitle || `Vị trí tiêu chuẩn (${idealType})`,
        roleArchetype: MBTI_PROFILES[idealType].title,
        roleArchetypeVi: MBTI_PROFILES[idealType].vietnameseTitle,
        primaryIdealType: idealType,
        idealTypes: [idealType],
        keyTraitsNeeded: MBTI_PROFILES[idealType].strengths,
        targetDimensions: {
          extraversionScore: idealType.startsWith('E') ? 75 : 25,
          intuitionScore: idealType.includes('N') ? 75 : 25,
          thinkingScore: idealType.includes('T') ? 75 : 25,
          judgingScore: idealType.endsWith('J') ? 75 : 25,
        },
        workEnvironmentDescription: MBTI_PROFILES[idealType].workStyle,
      };
    }
  } else {
    rolePersona = detectIdealMBTIForJob(jobTitle, rawJdText);
  }

  const idealProfileInfo = MBTI_PROFILES[rolePersona.primaryIdealType];
  const cDims = candidateMBTI.dimensions;
  const rDims = rolePersona.targetDimensions;
  const cType = candidateMBTI.mbtiType;

  // 3. Dimension-by-Dimension Comparison
  const diffEI = Math.abs(cDims.extraversion - rDims.extraversionScore);
  const scoreEI = Math.max(0, Math.round(100 - diffEI));

  const diffSN = Math.abs(cDims.intuition - rDims.intuitionScore);
  const scoreSN = Math.max(0, Math.round(100 - diffSN));

  const diffTF = Math.abs(cDims.thinking - rDims.thinkingScore);
  const scoreTF = Math.max(0, Math.round(100 - diffTF));

  const diffJP = Math.abs(cDims.judging - rDims.judgingScore);
  const scoreJP = Math.max(0, Math.round(100 - diffJP));

  // 4. Calculate Overall Synergy Score
  let baseFit = 80;
  if (rolePersona.idealTypes.includes(cType)) {
    if (cType === rolePersona.primaryIdealType) {
      baseFit = 96;
    } else {
      baseFit = 90;
    }
  } else {
    // Check shared letters count (1 to 4)
    let sharedCount = 0;
    for (let i = 0; i < 4; i++) {
      if (cType[i] === rolePersona.primaryIdealType[i]) sharedCount++;
    }
    if (sharedCount === 3) baseFit = 85;
    else if (sharedCount === 2) baseFit = 76;
    else if (sharedCount === 1) baseFit = 68;
    else baseFit = 58;
  }

  const dimensionAverage = (scoreEI + scoreSN + scoreTF + scoreJP) / 4;
  const synergyScore = Math.min(99, Math.max(45, Math.round(baseFit * 0.6 + dimensionAverage * 0.4)));

  let fitLevel: DualMBTIMatchAnalysis['fitLevel'] = 'BALANCED_GROWTH_FIT';
  let fitLevelLabel = 'Hòa Hợp Trung Bình (Balanced Fit)';
  if (synergyScore >= 90) {
    fitLevel = 'PERFECT_NATURAL_FIT';
    fitLevelLabel = 'Khớp Hoàn Hảo Tính Cách Tự Nhiên (90 - 99%)';
  } else if (synergyScore >= 80) {
    fitLevel = 'STRONG_CULTURAL_FIT';
    fitLevelLabel = 'Độ Hòa Hợp Rất Cao (80 - 89%)';
  } else if (synergyScore >= 65) {
    fitLevel = 'BALANCED_GROWTH_FIT';
    fitLevelLabel = 'Độ Hòa Hợp Khá & Tiềm Năng Bổ Trợ (65 - 79%)';
  } else {
    fitLevel = 'POTENTIAL_MISALIGNMENT';
    fitLevelLabel = 'Cần Đánh Giá Kỹ Phong Cách Làm Việc (< 65%)';
  }

  // 5. Dimension Breakdown Details
  const dimensionComparisons: DualMBTIMatchAnalysis['dimensionComparisons'] = [
    {
      dimension: 'EI',
      title: 'Năng Lượng & Giao Tiếp (Extraversion vs Introversion)',
      roleExpectation: rDims.extraversionScore >= 60 ? `Cần hướng ngoại (${rDims.extraversionScore}% E) để điều phối liên phòng ban` : `Cần hướng nội tập trung sâu (${100 - rDims.extraversionScore}% I) vào hệ thống`,
      candidatePreference: `Ứng viên: ${cDims.extraversion >= 50 ? `${cDims.extraversion}% Hướng ngoại (E)` : `${cDims.introversion}% Hướng nội (I)`}`,
      score: scoreEI,
      status: scoreEI >= 75 ? 'ALIGNED' : scoreEI >= 55 ? 'BALANCED' : 'DIVERGENT',
      statusText: scoreEI >= 75 ? 'Rất Đồng Điệu' : scoreEI >= 55 ? 'Hài Hòa' : 'Khác Biệt',
      insightComment: scoreEI >= 75 
        ? 'Mức độ tương tác xã hội của ứng viên khớp tự nhiên với mật độ họp và phối hợp của công việc.'
        : 'Ứng viên có thể cần không gian làm việc riêng biệt hoặc thời gian chuẩn bị trước khi tham gia các phiên thảo luận nhóm lớn.',
    },
    {
      dimension: 'SN',
      title: 'Thu Thập Thông Tin (Sensing vs Intuition)',
      roleExpectation: rDims.intuitionScore >= 60 ? `Cần tư duy khái quát & trực giác (${rDims.intuitionScore}% N)` : `Cần bám sát chi tiết thực tế (${100 - rDims.intuitionScore}% S)`,
      candidatePreference: `Ứng viên: ${cDims.intuition >= 50 ? `${cDims.intuition}% Trực giác (N)` : `${cDims.sensing}% Cụ thể (S)`}`,
      score: scoreSN,
      status: scoreSN >= 75 ? 'ALIGNED' : scoreSN >= 55 ? 'BALANCED' : 'DIVERGENT',
      statusText: scoreSN >= 75 ? 'Rất Đồng Điệu' : scoreSN >= 55 ? 'Hài Hòa' : 'Khác Biệt',
      insightComment: scoreSN >= 75
        ? 'Cách nhìn nhận vấn đề từ tổng thể đến chi tiết hoàn toàn phù hợp với bản chất nghiệp vụ của vị trí.'
        : 'Cần cung cấp tài liệu đặc tả rõ ràng (nếu thiên về S) hoặc cho phép tự do đề xuất giải pháp (nếu thiên về N).',
    },
    {
      dimension: 'TF',
      title: 'Ra Quyết Định (Thinking vs Feeling)',
      roleExpectation: rDims.thinkingScore >= 60 ? `Cần quyết định dựa trên logic & dữ liệu (${rDims.thinkingScore}% T)` : `Cần thấu cảm & trải nghiệm cảm xúc (${100 - rDims.thinkingScore}% F)`,
      candidatePreference: `Ứng viên: ${cDims.thinking >= 50 ? `${cDims.thinking}% Logic (T)` : `${cDims.feeling}% Cảm xúc (F)`}`,
      score: scoreTF,
      status: scoreTF >= 75 ? 'ALIGNED' : scoreTF >= 55 ? 'BALANCED' : 'DIVERGENT',
      statusText: scoreTF >= 75 ? 'Rất Đồng Điệu' : scoreTF >= 55 ? 'Hài Hòa' : 'Khác Biệt',
      insightComment: scoreTF >= 75
        ? 'Tiêu chuẩn đánh giá và ra quyết định của ứng viên đáp ứng đúng yêu cầu trọng tâm của vai trò.'
        : 'Mang lại góc nhìn đa chiều giúp cân bằng giữa tính đúng đắn kỹ thuật và sự gắn kết của người dùng/đội ngũ.',
    },
    {
      dimension: 'JP',
      title: 'Phong Cách Tổ Chức (Judging vs Perceiving)',
      roleExpectation: rDims.judgingScore >= 60 ? `Cần kế hoạch bài bản, kỷ luật (${rDims.judgingScore}% J)` : `Cần linh hoạt thích ứng thay đổi (${100 - rDims.judgingScore}% P)`,
      candidatePreference: `Ứng viên: ${cDims.judging >= 50 ? `${cDims.judging}% Kế hoạch (J)` : `${cDims.perceiving}% Linh hoạt (P)`}`,
      score: scoreJP,
      status: scoreJP >= 75 ? 'ALIGNED' : scoreJP >= 55 ? 'BALANCED' : 'DIVERGENT',
      statusText: scoreJP >= 75 ? 'Rất Đồng Điệu' : scoreJP >= 55 ? 'Hài Hòa' : 'Khác Biệt',
      insightComment: scoreJP >= 75
        ? 'Tác phong quản lý thời gian và bám sát tiến độ sprint cực kỳ ăn khớp với quy trình làm việc của vị trí này.'
        : 'Cần thống nhất trước về quy trình chốt deadline và các cột mốc bàn giao dự án.',
    },
  ];

  // 6. Strengths in Role
  const strengthsInRole: string[] = [];
  strengthsInRole.push(`Tố chất tự nhiên của ${candidateMBTI.profile.vietnameseTitle} (${cType}) phát huy tối đa ở môi trường "${rolePersona.roleTitle}".`);
  strengthsInRole.push(...candidateMBTI.profile.strengths.slice(0, 3));
  if (rolePersona.idealTypes.includes(cType)) {
    strengthsInRole.push(`Nằm trong nhóm tính cách hạt nhân (${rolePersona.idealTypes.join(', ')}) được các tổ chức công nghệ hàng đầu ưu tiên cho vai trò này.`);
  }

  // 7. Potential Friction & Stressors
  const potentialFrictionOrStress: string[] = [];
  if (cDims.extraversion < 35 && rDims.extraversionScore >= 70) {
    potentialFrictionOrStress.push('Áp lực giao tiếp: Vị trí đòi hỏi họp và đàm phán liên tục, ứng viên có thể bị cạn năng lượng nếu không có thời gian nghỉ riêng.');
  }
  if (cDims.judging < 35 && rDims.judgingScore >= 75) {
    potentialFrictionOrStress.push('Áp lực quy trình: Vị trí yêu cầu tuân thủ nghiêm ngặt checklist và deadline cố định, cần hỗ trợ công cụ quản lý công việc rõ ràng.');
  }
  if (cDims.feeling >= 65 && rDims.thinkingScore >= 80) {
    potentialFrictionOrStress.push('Áp lực phản biện: Khi nhận code review khắt khe hoặc tranh luận kỹ thuật trực diện, ứng viên có thể nhạy cảm với cách dùng từ.');
  }
  if (potentialFrictionOrStress.length === 0) {
    potentialFrictionOrStress.push('Mức độ tương thích cao, ít rủi ro xung đột tâm lý khi tiếp nhận công việc.');
    potentialFrictionOrStress.push(`Cần chú ý hỗ trợ ứng viên phát triển điểm: ${candidateMBTI.profile.growthAreas[0] || 'mở rộng kỹ năng giao tiếp'}.`);
  }

  // 8. Customized Behavioral Interview Probes for Recruiter
  const behavioralInterviewProbes: string[] = [
    `Đối với vị trí ${rolePersona.roleTitle}, khi gặp mâu thuẫn giữa tiến độ bàn giao gấp và chất lượng kiến trúc code, bạn sẽ xử lý như thế nào?`,
    `Với phong cách làm việc của một ${cType} (${candidateMBTI.profile.vietnameseTitle}), bạn mong đợi môi trường làm việc lý tưởng và người quản lý trực tiếp hỗ trợ mình ra sao?`,
    ...candidateMBTI.profile.behavioralQuestions.slice(0, 2),
  ];

  // 9. Management & Onboarding Tips
  const managerOnboardingTips: string[] = [
    `Giao việc rõ ràng về mục tiêu đầu ra (DoD - Definition of Done) và trao quyền tự chủ trong cách thực hiện cho ứng viên (${cType}).`,
    `Trong 2 tuần đầu onboarding, tạo không gian để ứng viên làm quen với luồng kiến trúc trước khi giao các tác vụ áp lực cao.`,
    `Thực hiện 1-on-1 định kỳ để lắng nghe phản hồi và ghi nhận các đóng góp đổi mới kỹ thuật của ứng viên.`,
  ];

  return {
    candidateMBTI,
    rolePersona,
    idealProfileInfo,
    synergyScore,
    fitLevel,
    fitLevelLabel,
    dimensionComparisons,
    strengthsInRole,
    potentialFrictionOrStress,
    behavioralInterviewProbes,
    managerOnboardingTips,
  };
}

