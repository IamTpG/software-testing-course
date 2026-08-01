# T02 - Phân công hoàn thiện seminar trong ngày 14/07/2026

> **Đề tài:** Web Automation Testing  
> **Stack đề xuất:** Playwright (TypeScript) + GitHub Copilot, có đối chứng AI/self-healing nếu khả thi  
> **Mục tiêu trong ngày:** Hoàn thiện bộ tài liệu và sản phẩm nộp gồm báo cáo, slide, video demo, mã nguồn/file cấu hình/scripts và các phụ lục theo yêu cầu briefing.

---

## 1. Chuẩn đầu ra phải nộp

| Nhóm sản phẩm | File/artefact cần có | Tiêu chuẩn hoàn thành |
|---|---|---|
| Báo cáo | `Group02.md` hoặc báo cáo cuối tương đương, có thể xuất PDF | Có lý thuyết, khảo sát phần mềm, lý do chọn công cụ, kịch bản demo, chi tiết phần mềm demo, kết quả thử nghiệm, rủi ro/failure modes, khai báo sử dụng AI |
| Proposal | `T02_De_Xuat_Cong_Cu_Web_Automation_Testing.md` | Đã bổ sung cơ sở lý thuyết kiểm thử tự động và lập luận chọn Playwright + Copilot |
| Slide | `Seminar_Slides.pptx` hoặc bản slide tương đương | Tối đa 15 slide, đủ lý thuyết, khảo sát công cụ, demo, AI, rủi ro và kết luận |
| Video demo | `Demo_Screencast.mp4` và link YouTube | 5-8 phút, có ít nhất 1 tính năng công cụ truyền thống và 1 tính năng AI |
| Mã nguồn/demo | Thư mục demo Playwright, `package.json`, `playwright.config.*`, test scripts | Chạy được bằng CLI hoặc có fallback screenshot/trace nếu môi trường lỗi |
| Hướng dẫn | `User_Guide.md` | Có ít nhất 6 mục, gồm setup, run test, xem report/trace, troubleshooting, failure modes |
| Hoạt động lớp | `Activity_Worksheet.md` | Hoạt động tái lập được trong tối đa 25 phút, không phụ thuộc nhiều vào người hướng dẫn |
| Minh chứng | Screenshot, trace, report, prompt log, commit log | Có thể đối chiếu khi giảng viên/TA hỏi |

---

## 2. Lịch hoàn thiện trong ngày

| Khung giờ | Mục tiêu | Việc cần chốt |
|---|---|---|
| 08:00-09:00 | Kickoff nội bộ | Chốt file nộp, branch/thư mục làm việc, format Markdown, deadline từng người |
| 09:00-11:30 | Hoàn thiện nội dung lõi | Bổ sung lý thuyết vào báo cáo, chốt khảo sát công cụ, chốt demo flow |
| 11:30-14:00 | Hoàn thiện demo/code | Chạy Playwright, thu screenshot/trace/report, ghi chú lỗi và cách tái lập |
| 14:00-16:00 | Làm slide và script video | Slide <= 15 trang, script nói 5-8 phút, chia người nói trong video |
| 16:00-18:00 | Quay video demo | Quay bản chính, nếu fail dùng screenshot/trace/report làm fallback có giải thích |
| 18:00-20:00 | Tích hợp báo cáo cuối | Ghép lý thuyết, khảo sát, demo, failure modes, checklist file nộp |
| 20:00-22:00 | Review chéo và đóng gói | Kiểm tra link, chạy lại lệnh, xuất PDF nếu cần, chuẩn bị zip/source |

---

## 3. Phân công theo thành viên

### 3.1. 23127241 - Đoàn Thành Phát

**Vai trò chính:** Lead kỹ thuật demo Playwright và mã nguồn nộp.

| Việc | Đầu ra | Deadline |
|---|---|---|
| Chuẩn bị hoặc rà lại project demo Playwright | Thư mục mã nguồn, `package.json`, `playwright.config.*`, test scripts | 11:30 |
| Hoàn thiện ít nhất 1 flow chạy chắc chắn, ưu tiên Add-to-Cart; nếu kịp thêm Login/Checkout | Test script, command chạy, expected result | 14:00 |
| Thu bằng chứng chạy test | HTML report, screenshot, trace/video nếu có | 15:00 |
| Viết phần "Chi tiết phần mềm demo" | Mô tả SUT EShop, môi trường, command chạy, cấu trúc code | 18:00 |
| Hỗ trợ quay video phần demo truyền thống | Đoạn demo Playwright 2-3 phút | 18:00 |

**Tiêu chí xong:** Người khác clone/copy source và biết chạy test bằng lệnh trong `User_Guide.md`; nếu không chạy được live thì có evidence đủ rõ.

### 3.2. 23127244 - Lê Thiên Phú

**Vai trò chính:** Lead tài liệu hướng dẫn, activity và tính tái lập.

| Việc | Đầu ra | Deadline |
|---|---|---|
| Soạn `User_Guide.md` | Setup, run test, report/trace, troubleshooting, failure modes | 14:00 |
| Soạn `Activity_Worksheet.md` | Hoạt động "Locator Brawl" tối đa 25 phút | 15:00 |
| Viết phần CI/CD và hướng dẫn tái lập trong báo cáo | Mục lệnh chạy local/CI, yêu cầu môi trường | 17:00 |
| Review chéo mã nguồn của Phát | Ghi chú thiếu dependency, thiếu command, thiếu file config | 18:00 |
| Cung cấp 2-3 slide về locator/synchronization/CI | Nội dung slide ngắn, có ví dụ | 16:00 |

**Tiêu chí xong:** Một nhóm khác đọc hướng dẫn có thể setup/chạy demo hoặc hiểu fallback trong thời gian ngắn.

### 3.3. 23127262 - Lý Quốc Thạnh

**Vai trò chính:** Lead phần AI/self-healing, khảo sát công cụ đối chứng và failure modes.

| Việc | Đầu ra | Deadline |
|---|---|---|
| Hoàn thiện bảng khảo sát AI-native/low-code | Katalon, Testim, mabl, Virtuoso, ACCELQ; ưu/nhược/khả năng tái lập | 11:30 |
| Viết phần failure modes tối thiểu 3 tình huống | Self-healing sai, locator AI mong manh, assertion AI quá lỏng, cloud trial/quota | 14:00 |
| Chuẩn bị demo AI hoặc fallback | Copilot sinh test draft, screenshot, prompt log hoặc mô phỏng self-healing | 15:30 |
| Viết phần Q&A về rủi ro AI | Câu trả lời ngắn cho false pass, hallucination, trách nhiệm tester | 17:00 |
| Cung cấp 2-3 slide về AI trong testing | AI hỗ trợ gì, không thay thế gì, kiểm soát thế nào | 16:00 |

**Tiêu chí xong:** Video/slide có thể chứng minh nhóm dùng AI có kiểm soát, không trình bày AI như công cụ tự động đúng tuyệt đối.

### 3.4. 23127373 - Nguyễn Đình Thái Hưng

**Vai trò chính:** Lead tích hợp báo cáo, slide, video và bộ nộp cuối.

| Việc | Đầu ra | Deadline |
|---|---|---|
| Tích hợp phần lý thuyết vào báo cáo cuối | Mục lý thuyết kiểm thử tự động trong báo cáo | 12:00 |
| Dựng slide tổng thể | `Seminar_Slides.pptx` hoặc bản tương đương <= 15 slide | 16:30 |
| Viết script video 5-8 phút | Phân cảnh: mở đầu, lý thuyết, demo Playwright, AI, kết luận | 15:30 |
| Quay/ghép/upload video | `Demo_Screencast.mp4`, link YouTube hoặc link dự phòng | 19:00 |
| Đóng gói file nộp và checklist | Báo cáo, slide, video link, source/config/scripts, prompt log, evidence | 21:30 |

**Tiêu chí xong:** Bộ nộp cuối nhất quán tên file, không thiếu link video/source, báo cáo và slide nói cùng một hướng.

---

## 4. Phân chia theo sản phẩm nộp

| Sản phẩm | Lead | Người hỗ trợ | Nội dung bắt buộc |
|---|---|---|---|
| Báo cáo | Hưng | Phát, Phú, Thạnh | Lý thuyết, khảo sát phần mềm, kịch bản demo, chi tiết EShop/demo, kết quả, failure modes, AI usage |
| Slide | Hưng | Cả nhóm | <= 15 slide; mỗi người cung cấp phần mình phụ trách |
| Video demo | Hưng | Phát, Thạnh | Playwright truyền thống + AI/Copilot/self-healing; 5-8 phút |
| Source/config/scripts | Phát | Phú | Project Playwright, config, test scripts, README hoặc lệnh chạy |
| User guide | Phú | Phát, Thạnh | Setup, chạy test, xem report, troubleshooting, failure modes |
| Activity worksheet | Phú | Hưng | Locator Brawl <= 25 phút, có expected result |
| AI/failure modes | Thạnh | Hưng | Tối thiểu 3 failure modes và cách kiểm soát |
| Đóng gói cuối | Hưng | Cả nhóm | Kiểm tra file, link, format, PDF/zip nếu cần |

---

## 5. Checklist review cuối ngày

- [ ] Báo cáo có mục lý thuyết kiểm thử tự động, không chỉ liệt kê công cụ.
- [ ] Báo cáo có khảo sát phần mềm và lý do chọn Playwright + GitHub Copilot.
- [ ] Báo cáo có kịch bản demo và chi tiết phần mềm demo EShop.
- [ ] Slide không quá 15 trang và bám cùng luận điểm với báo cáo.
- [ ] Video demo dài 5-8 phút và có cả phần truyền thống lẫn AI.
- [ ] Source/config/scripts đủ để chạy hoặc giải thích fallback.
- [ ] `User_Guide.md` có failure modes tối thiểu 3 tình huống gây hiểu nhầm.
- [ ] `Activity_Worksheet.md` có thể làm trong tối đa 25 phút.
- [ ] Có screenshot/report/trace/prompt log/commit log làm minh chứng.
- [ ] Link YouTube, link repo/source hoặc file zip hoạt động.
- [ ] Tên file nộp thống nhất, không còn placeholder như `VIDEO_ID`.

---

## 6. Thứ tự ưu tiên nếu thiếu thời gian

1. Báo cáo cuối có đủ lý thuyết, khảo sát, demo plan và failure modes.
2. Demo Playwright chạy được ít nhất 1 flow, có screenshot/trace/report.
3. Video 5-8 phút có Playwright + AI/Copilot hoặc fallback AI rõ ràng.
4. Slide <= 15 trang, đủ để trình bày mạch seminar.
5. User guide và activity worksheet đạt mức tái lập tối thiểu.
6. Đóng gói source/config/scripts và minh chứng.
