# Activity Worksheet: Locator Brawl — Hand-crafted vs AI-suggested

> Đề tài T02 — Web Automation Testing · Nộp Stage S5 · Thời lượng hoạt động: 25 phút

---

## 0. Mục tiêu & luật chơi tổng quan

Hai đội cùng viết một test Add-to-Cart trên EShop theo hai cách khác nhau, rồi so sánh kết quả trực tiếp để tự rút ra rubric "good locator" — không chỉ nghe lý thuyết.

- **Đội A (Hand-crafted locator)**: tự chọn locator; được dùng AI hỗ trợ cú pháp Playwright nhưng không hỏi AI locator nào tốt.
- **Đội B (AI-suggested locator)**: mô tả scenario cho AI, để AI quyết định cả locator lẫn cách viết test; không tự sửa lại locator AI đã chọn.
- Biến số so sánh duy nhất là **ai chọn locator** (người hay AI) — cả hai đội đều được dùng AI hỗ trợ viết code.
- Hoạt động này được thiết kế để tái lập ≤ 25 phút mà **không cần hỗ trợ của nhóm thuyết trình**.

---

## Phần I — Nội dung phát cho khán giả

### A. Chuẩn bị trước hoạt động (làm trước giờ, KHÔNG tính vào 25 phút)

**Mỗi đội tự host một bản EShop riêng trên máy mình** — không dùng chung 1 instance với đội khác, vì mỗi đội có DB SQLite local độc lập, tránh 2 đội cùng ghi vào 1 giỏ hàng làm sai lệch kết quả (vi phạm nguyên tắc Test Isolation — mục 2.4 báo cáo).

```bash
git clone https://github.com/ttbhanh/eshop-sut.git
cd eshop-sut

# Backend
cd EShop/backend
npm install
node database.js   # khởi tạo dữ liệu mẫu, chỉ chạy lần đầu
node server.js      # để chạy nền, giữ cửa sổ terminal này mở — http://localhost:3000

# Frontend Web (terminal khác)
cd EShop/frontend-web
npm install
npm run dev          # http://localhost:5173
```

- Có sẵn script `run_servers.sh` trong repo, tự động khởi động backend + frontend cùng lúc nếu muốn nhanh hơn.
- Prerequisite: Node.js ≥ 18, npm, trình duyệt Chrome/Chromium.
- Có sẵn tài khoản AI coding assistant bất kỳ (Copilot/Claude/Codex/ChatGPT... — kể cả bản miễn phí), dùng cho Đội B và phần hỗ trợ cú pháp của Đội A.
- **Không cần biết Playwright trước** — worksheet đủ chi tiết để người mới làm theo được.
- *Dự phòng*: nếu một đội không tự host kịp (lỗi cài đặt, máy yếu...), facilitator có 1 instance host sẵn để đội đó dùng tạm — nhưng đội đó phải **tự đăng ký tài khoản mới** qua trang Register thay vì dùng chung tài khoản test với đội khác, để tránh đụng dữ liệu.

### B. Setup Playwright (≤ 3 phút, tính trong 25 phút hoạt động)

```bash
npm init playwright@latest -- --yes
```

- Dán snippet `throttle.ts` (mục F) vào thư mục `tests/` hoặc `utils/` của project.
- Xác nhận EShop đã chạy tại `http://localhost:5173` (đã tự host ở mục A).

### C. Scenario & Test Data

- **Flow cần test**: Add-to-Cart — đăng nhập → mở trang sản phẩm → thêm 1 sản phẩm vào giỏ → kiểm tra số trên badge giỏ hàng tăng đúng.
- **Tài khoản demo** (đã có sẵn trong dữ liệu mẫu của repo, dùng được ngay vì mỗi đội có DB riêng): `test@eshop.com` / `Test1234!`.
- **Sản phẩm dùng để test**: chọn **sản phẩm đầu tiên** trong danh sách hiển thị ở trang chủ — cố định theo thứ tự này để mọi đội test cùng một sản phẩm mà không cần thống nhất tên cụ thể.
- **Kết quả mong đợi (oracle)**: số trên badge giỏ hàng tăng đúng 1 đơn vị so với trước khi thêm. Đây là assertion bắt buộc — **không** được thay bằng "nút Add to Cart hiển thị" hay "click thành công" (assert đúng kết quả nghiệp vụ, không chỉ assert thao tác thực hiện được).

### D. Luật chơi cho từng đội

| | Đội A (Hand-crafted) | Đội B (AI-suggested) |
|---|---|---|
| Chọn locator | Tự chọn, ưu tiên role/label/text/test-id | Để AI chọn, không tự sửa lại |
| Dùng AI | Chỉ hỏi cú pháp Playwright (`test()`, `expect()`...) | Mô tả scenario bằng ngôn ngữ tự nhiên, để AI sinh toàn bộ test |
| Thời gian viết | 7 phút | 7 phút |
| Không được làm | Không hỏi AI "locator nào tốt nhất cho phần tử này" | Không tự ý đổi locator AI đã chọn dù thấy "trông không ổn" |

### E. Bảng ghi nhận kết quả (điền khi chạy test 3 lần)

| Lần chạy | Pass/Fail | Locator đã dùng | Lỗi ghi nhận (nếu fail) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

### F. Snippet giả lập mạng chậm (throttle)

Copy-paste trực tiếp, không cần tự viết:

```ts
// throttle.ts — dán vào project, gọi throttleToSlow3G(page) ngay sau khi mở trang
import { Page } from '@playwright/test';

export async function throttleToSlow3G(page: Page) {
  const client = await page.context().newCDPSession(page); // chỉ hoạt động trên Chromium
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1000) / 8, // ~500 kbps, tương đương preset Slow 3G của DevTools
    uploadThroughput: (500 * 1000) / 8,
    latency: 400, // ms
  });
}
```

*Vì sao không share 4G/WiFi thật cho cả lớp*: tốc độ mạng thật không ổn định/không đo lường được, nhiều đội chạy cùng lúc trên chung kết nối sẽ tranh băng thông khiến kết quả không so sánh được. Playwright chưa có tính năng throttle tích hợp sẵn, nên cách đúng kỹ thuật là gọi thẳng Chrome DevTools Protocol (`Network.emulateNetworkConditions`) trong code, để mỗi máy tự giả lập mạng chậm cục bộ, giống hệt nhau giữa các đội. Chỉ hoạt động trên Chromium — không ảnh hưởng vì đó là trình duyệt mặc định của Playwright.

### G. Rubric "good locator" (dùng để thảo luận cuối giờ)

| Tiêu chí | Yếu (1 điểm) | Trung bình (2 điểm) | Tốt (3 điểm) |
|---|---|---|---|
| Loại locator | XPath/CSS theo vị trí DOM sâu (VD: `div > div:nth-child(3) > button`) | CSS class/id dùng chung với style giao diện | Role/Label/Text/Test-id (VD: `getByRole`, `data-testid`) |
| Độ ổn định qua 3 lần chạy | Fail ít nhất 1 lần | Pass nhưng cần retry/không ổn định | Pass ổn định cả 3 lần |
| Độc lập với style/layout | Gắn liền class dùng cho CSS, dễ vỡ khi đổi giao diện | Một phần độc lập | Hoàn toàn tách biệt khỏi style (thuộc tính test riêng) |
| Dễ đọc / thể hiện đúng ý định | Khó đoán locator đang nhắm tới phần tử nào | Đoán được nhưng dài dòng | Rõ ràng, đúng ý định của test |

---

## Phần II — Answer Key (chỉ dành cho facilitator, không phát khán giả)

- **Kết quả thường thấy ở Đội A**: locator dùng role/label/test-id thường pass ổn định cả 3 lần dù mạng chậm, vì không phụ thuộc thời gian render animation/style.
- **Kết quả thường thấy ở Đội B**: nhiều khả năng AI chọn CSS/XPath ngắn gọn nhưng bám cấu trúc DOM hiện tại; có thể fail ít nhất 1/3 lần khi mạng chậm làm DOM render trễ, hoặc nếu AI không tự thêm wait phù hợp.
- **Nếu cả 2 đội đều pass ổn định**: vẫn là kết quả hợp lệ — chuyển hướng thảo luận sang *khả năng đọc hiểu/bảo trì* của locator thay vì chỉ nhìn pass/fail.
- **Nếu Đội B không xong trong 7 phút** (AI sinh code lỗi cú pháp hoặc cần nhiều vòng chỉnh sửa): đây là dữ liệu hợp lệ cho phần thảo luận — minh hoạ đúng rủi ro "code AI sinh ra cần review kỹ", không phải sự cố cần che giấu.
- **Cách dẫn dắt thảo luận cuối giờ (5 phút)**: đối chiếu bảng ghi nhận kết quả thật (mục E) với rubric (mục G) trước — hỏi cả lớp "loại locator nào pass ổn định hơn, vì sao" — rồi mới đọc 3 kết luận tham khảo dưới đây để xác nhận hoặc phản biện bằng đúng dữ liệu vừa quan sát, tránh chốt kết luận trước khi có dữ liệu thật:
  - AI locator có xu hướng chọn XPath/CSS ngắn nhưng dễ gãy khi DOM đổi nhỏ.
  - Thuộc tính `data-test-id` vẫn thắng về khả năng bảo trì lâu dài.
  - Self-healing giảm nhiễu nhưng có thể che giấu lỗi thật — nên đi kèm visual diff/evidence.
