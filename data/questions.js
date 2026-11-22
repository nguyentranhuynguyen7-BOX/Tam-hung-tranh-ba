"use strict";

/**
 * NGÂN HÀNG CÂU HỎI LỊCH SỬ VIỆT NAM THẾ KỶ XVIII
 * Chủ đề: Kháng chiến chống quân Xiêm (1785) & quân Thanh (1789)
 * Gồm 12 câu chính (4 vòng x 3 câu) + các câu hỏi phụ phân định (Tie-breaker).
 */

const QUESTIONS = [
  // VÒNG 1: KHỞI ĐỘNG (100 điểm / câu)
  {
    id: 1,
    round: 1,
    question: "Nguyên nhân trực tiếp khiến quân Xiêm đưa quân tràn vào Gia Định nước ta năm 1784 là gì?",
    answers: [
      "Nhà Tây Sơn chủ động sang giao chiến",
      "Nguyễn Ánh sang Xiêm cầu viện quân cứu viện",
      "Triều đình nhà Lê cử sứ giả mời sang liên minh",
      "Nhà Thanh yêu cầu Xiêm phối hợp nam - bắc"
    ],
    correctAnswer: 1,
    explanation: "Năm 1784, sau nhiều lần thất bại trước Tây Sơn, Nguyễn Ánh chạy sang Xiêm cầu viện. Vua Xiêm nhân cơ hội đó sai tướng đem 5 vạn thủy bộ binh xâm lược miền Nam nước ta.",
    points: 100,
    difficulty: "Dễ"
  },
  {
    id: 2,
    round: 1,
    question: "Ai là vị chủ tướng trực tiếp chỉ huy nghĩa quân Tây Sơn đánh tan 5 vạn quân Xiêm tại Rạch Gầm – Xoài Mút?",
    answers: [
      "Nguyễn Nhạc",
      "Nguyễn Lữ",
      "Nguyễn Huệ",
      "Ngô Văn Sở"
    ],
    correctAnswer: 2,
    explanation: "Đầu năm 1785, Nguyễn Huệ được cử vào Gia Định trực tiếp tổ chức bố phòng và chỉ huy trận quyết chiến tiêu diệt hoàn toàn quân Xiêm trên sông Tiền.",
    points: 100,
    difficulty: "Dễ"
  },
  {
    id: 3,
    round: 1,
    question: "Chiến trường quyết chiến tiêu diệt đạo thủy binh quân Xiêm nằm trên đoạn sông nào?",
    answers: [
      "Sông Hồng (Bắc Bộ)",
      "Sông Tiền (đoạn Rạch Gầm – Xoài Mút, Tiền Giang)",
      "Sông Lam (Nghệ An)",
      "Sông Bạch Đằng (Quảng Ninh)"
    ],
    correctAnswer: 1,
    explanation: "Rạch Gầm và Xoài Mút là hai nhánh sông nhỏ đổ vào sông Tiền (nay thuộc tỉnh Tiền Giang), có cù lao Thới Sơn ở giữa tạo thành địa bàn mai phục thủy chiến lý tưởng.",
    points: 100,
    difficulty: "Dễ"
  },

  // VÒNG 2: CHIẾN THẮNG CHỐNG XIÊM (200 điểm / câu)
  {
    id: 4,
    round: 2,
    question: "Đại thắng Rạch Gầm – Xoài Mút đánh tan 5 vạn quân Xiêm diễn ra vào thời gian nào?",
    answers: [
      "Năm 1771",
      "Rạng sáng ngày 19/01/1785",
      "Mùa xuân năm 1788",
      "Đêm mùng 5 Tết năm 1789"
    ],
    correctAnswer: 1,
    explanation: "Trận quyết chiến diễn ra chớp nhoáng và quyết liệt vào rạng sáng ngày 19/01/1785 (đêm mùng 8 rạng mùng 9 tháng 12 năm Giáp Thìn). Chỉ trong một ngày, toàn bộ chiến thuyền giặc bị phá tan.",
    points: 200,
    difficulty: "Trung bình"
  },
  {
    id: 5,
    round: 2,
    question: "Vì sao Nguyễn Huệ chọn đoạn sông Rạch Gầm – Xoài Mút làm nơi nhử địch vào quyết chiến?",
    answers: [
      "Gần trung tâm đô thành Thăng Long",
      "Địa hình sông rộng, có rạch nhánh và cù lao rậm rạp thuận lợi bố trí đại bác và thủy binh mai phục",
      "Nơi đóng quân chính lâu đời của quân Xiêm",
      "Vùng giáp ranh biên giới giữa Đại Việt và Chân Lạp"
    ],
    correctAnswer: 1,
    explanation: "Đoạn sông Tiền từ Rạch Gầm đến Xoài Mút dài khoảng 6-7km, lòng sông rộng nhưng hai bờ cây cối rậm rạp, lại có cù lao Thới Sơn án ngữ ở giữa, rất thuận lợi để giấu quân và khép vòng vây hỏa lực.",
    points: 200,
    difficulty: "Trung bình"
  },
  {
    id: 6,
    round: 2,
    question: "Nét đặc sắc nổi bật nhất trong nghệ thuật quân sự của Tây Sơn tại Rạch Gầm – Xoài Mút là gì?",
    answers: [
      "Bao vây thành trì tiêu hao sinh lực địch qua nhiều tháng",
      "Nghi binh nhử địch vào trận địa phục kích đã chuẩn bị sẵn, kết hợp hỏa pháo từ hai bờ, cù lao và thuyền chiến bao vây",
      "Dàn trận giáp lá cà đơn thuần trên bộ",
      "Rút lui chiến lược chờ quân tiếp viện của triều Lê"
    ],
    correctAnswer: 1,
    explanation: "Nguyễn Huệ dùng chiến thuật nghi binh giả vờ thua để nhử chiến thuyền địch lọt vào trận địa mai phục, sau đó bất ngờ chặn đầu khóa đuôi, dùng hỏa pháo trên bờ và thuyền chiến hai bên nhánh rạch lao ra tiêu diệt sạch quân thù.",
    points: 200,
    difficulty: "Trung bình"
  },

  // VÒNG 3: CHIẾN THẮNG CHỐNG THANH (300 điểm / câu)
  {
    id: 7,
    round: 3,
    question: "Ai là người đã sang Trung Quốc cầu viện triều đình Mãn Thanh, dẫn tới cuộc xâm lược 29 vạn quân giặc vào cuối năm 1788?",
    answers: [
      "Nguyễn Ánh",
      "Vua Lê Chiêu Thống",
      "Tôn Sĩ Nghị",
      "Trần Hưng Đạo"
    ],
    correctAnswer: 1,
    explanation: "Vua tôi Lê Chiêu Thống vì muốn khôi phục ngai vàng mục nát đã cầu cứu triều Thanh. Vua Càn Long chớp cơ hội sai Tổng đốc Lưỡng Quảng Tôn Sĩ Nghị thống lĩnh 29 vạn quân ồ ạt kéo sang nước ta.",
    points: 300,
    difficulty: "Khá"
  },
  {
    id: 8,
    round: 3,
    question: "Trước khi xuất quân hành quân thần tốc ra Bắc, Nguyễn Huệ đã có quyết định lịch sử quan trọng nào tại Phú Xuân?",
    answers: [
      "Nhượng bộ nhường Bắc Hà cho quân Thanh",
      "Lên ngôi Hoàng đế lấy niên hiệu là Quang Trung vào tháng 12/1788 tại núi Bân",
      "Chờ quân của Nguyễn Nhạc từ Quy Nhơn ra hội quân",
      "Cầu viện hải quân các nước phương Tây"
    ],
    correctAnswer: 1,
    explanation: "Ngày 22/12/1788 (25 tháng 11 năm Mậu Thân), Nguyễn Huệ làm lễ tế cáo trời đất tại núi Bân (Phú Xuân - Huế), chính thức lên ngôi Hoàng đế lấy niên hiệu Quang Trung để quy tụ lòng dân cả nước.",
    points: 300,
    difficulty: "Khá"
  },
  {
    id: 9,
    round: 3,
    question: "Chiến dịch đại phá 29 vạn quân Thanh lịch sử gắn liền với mùa xuân năm nào?",
    answers: [
      "Mùa xuân năm 1785",
      "Mùa xuân Kỷ Dậu năm 1789",
      "Mùa xuân năm 1792",
      "Mùa xuân năm 1802"
    ],
    correctAnswer: 1,
    explanation: "Đúng vào dịp Tết Kỷ Dậu (tháng 1 - tháng 2 năm 1789), nghĩa quân Tây Sơn dưới sự chỉ huy tài ba của vua Quang Trung đã quét sạch 29 vạn quân Thanh ra khỏi bờ cõi chỉ trong 5 ngày đêm.",
    points: 300,
    difficulty: "Khá"
  },

  // VÒNG 4: QUYẾT CHIẾN (500 điểm / câu)
  {
    id: 10,
    round: 4,
    question: "Trong trận đánh hạ cứ điểm kiên cố Ngọc Hồi (mùng 5 Tết), nghĩa quân Tây Sơn đã sáng tạo vũ khí gì để vô hiệu hóa đại bác giặc?",
    answers: [
      "Những tấm mộc lớn bện bằng rơm ngâm ướt nước kết hợp 20 dũng sĩ áp sát",
      "Các loại khiên bằng đồng của quân phương Tây",
      "Đào đường hầm ngầm phát hỏa thuốc nổ",
      "Dùng thuyền bọc sắt cơ động trên sông"
    ],
    correctAnswer: 0,
    explanation: "Quân Tây Sơn kết 20 người một khối, lấy những tấm mộc lớn đan bằng rơm cuộn rơm ngâm đẫm nước che trước ngực để chống đỡ đạn lửa, tên độc và đại bác của địch rồi xông thẳng vào phá đồn.",
    points: 500,
    difficulty: "Khó"
  },
  {
    id: 11,
    round: 4,
    question: "Nghệ thuật quân sự kiệt xuất nhất của vua Quang Trung trong chiến dịch đánh Thanh năm 1789 là gì?",
    answers: [
      "Hành quân thần tốc, giữ bí mật tuyệt đối, mở đòn tiến công bất ngờ đúng vào dịp Tết Nguyên đán khiến giặc không kịp trở tay",
      "Phòng thủ cố định chờ quân địch hết lương thảo",
      "Đàm phán hòa hoãn kéo dài để chia rẽ các đạo quân giặc",
      "Tập trung toàn lực đánh trận thủy chiến trên sông Bạch Đằng"
    ],
    correctAnswer: 0,
    explanation: "Nghệ thuật tiến công thần tốc (vừa hành quân vừa tuyển mộ, luyện binh), tổ chức ăn Tết sớm và xuất kích táo bạo bất ngờ khi giặc đang mải mê rượu chè ăn Tết ở Thăng Long đã tạo nên chiến thắng vô tiền khoáng hậu.",
    points: 500,
    difficulty: "Khó"
  },
  {
    id: 12,
    round: 4,
    question: "Ý nghĩa lịch sử chung lớn nhất của hai cuộc kháng chiến chống Xiêm (1785) và chống Thanh (1789) là gì?",
    answers: [
      "Mở đầu cho thời kỳ suy tàn của các vương triều phong kiến",
      "Đập tan âm mưu xâm lược của phong kiến nước ngoài, bảo vệ vững chắc nền độc lập chủ quyền của Tổ quốc và khẳng định nghệ thuật quân sự Tây Sơn",
      "Thống nhất đất nước và chấm dứt chiến tranh vĩnh viễn",
      "Mở rộng biên giới nước ta sang vùng Đông Nam Á lục địa"
    ],
    correctAnswer: 1,
    explanation: "Cả hai chiến thắng vĩ đại đều bảo vệ vững chắc nền độc lập, chủ quyền và toàn vẹn lãnh thổ, ngăn chặn thảm họa đô hộ, đồng thời ghi dấu đỉnh cao thiên tài quân sự của anh hùng dân tộc Quang Trung - Nguyễn Huệ.",
    points: 500,
    difficulty: "Khó"
  }
];

// CÂU HỎI PHỤ PHÂN ĐỊNH (TIE-BREAKER) - Dành riêng khi hai hoặc ba phe bằng điểm
const TIE_BREAKER_QUESTIONS = [
  {
    id: 101,
    round: "PHỤ",
    question: "Ai là danh sĩ đã đề xuất kế sách tạm rút lui chiến lược về lập phòng tuyến Tam Điệp – Biện Sơn để bảo toàn lực lượng chờ Quang Trung?",
    answers: [
      "Ngô Thì Nhậm",
      "Phan Huy Ích",
      "Bùi Thị Xuân",
      "Nguyễn Thiếp"
    ],
    correctAnswer: 0,
    explanation: "Ngô Thì Nhậm đã hiến kế cho Ngô Văn Sở tạm rút quân khỏi Thăng Long về đóng giữ cửa hiểm Tam Điệp (Ninh Bình) và Biện Sơn (Thanh Hóa): 'mở cửa thành cho giặc vào để rồi đập tan chúng'.",
    points: 150,
    difficulty: "Phân định"
  },
  {
    id: 102,
    round: "PHỤ",
    question: "Lời hịch bất hủ: 'Đánh cho để dài tóc, Đánh cho để đen răng, Đánh cho nó chích luân bất phản...' được Quang Trung ban bố tại đâu?",
    answers: [
      "Lễ duyệt binh tại Nghệ An",
      "Kinh thành Phú Xuân (Huế)",
      "Phòng tuyến Tam Điệp",
      "Thành Hoàng Đế (Quy Nhơn)"
    ],
    correctAnswer: 0,
    explanation: "Tại lễ duyệt binh lớn ở Nghệ An cuối năm 1788, vua Quang Trung đã đọc lời hịch hào hùng khơi dậy sâu sắc lòng yêu nước và ý chí quật cường của toàn quân trước giờ xuất trận.",
    points: 150,
    difficulty: "Phân định"
  },
  {
    id: 103,
    round: "PHỤ",
    question: "Trận đánh bất ngờ vào sáng mùng 5 Tết Kỷ Dậu khiến tướng giặc Sầm Nghi Đống phải khiếp đảm thắt cổ tự vẫn diễn ra tại đâu?",
    answers: [
      "Đồn Đống Đa (Khương Thượng)",
      "Đồn Hà Hồi",
      "Đồn Ngọc Hồi",
      "Cung Tây Long"
    ],
    correctAnswer: 0,
    explanation: "Đạo quân của Đô đốc Đặng Tiến Đông (hoặc Đô đốc Long) bất ngờ tập kích đồn Khương Thượng - Đống Đa khiến quân giặc vỡ trận tan tác, chủ tướng Sầm Nghi Đống phải treo cổ tự vẫn ở núi Loa Sơn.",
    points: 150,
    difficulty: "Phân định"
  }
];
