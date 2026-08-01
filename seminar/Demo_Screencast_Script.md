# Demo Screencast — Kịch bản quay

> **Deliverable:** `Demo_Screencast.mp4` (Stage S4)
> **Seminar:** T02 — Web Automation Testing · Nhóm 23KTPM1_02
> **Thời lượng đích:** 7:30 (specs cho phép 5–8 phút)
> **Narration:** tiếng Việt · **Không nhạc nền** · **Terminal/IDE thật, cấm dựng giả**

Kịch bản bám 100% vào bằng chứng nhóm đã chạy thật (xem `User_Guide.md`). Mọi con số và thông báo lỗi trong lời thoại đều là số thật — quay xong nhớ đối chiếu lại màn hình, đừng đọc thuộc lòng một con số khác.

**Quy tắc bắt buộc của brief:** demo phải thể hiện **ít nhất 1 tính năng của công cụ truyền thống** (Playwright: locator, auto-wait, trace viewer) **VÀ ít nhất 1 tính năng AI** (AI assistant sinh test). Kịch bản này có cả hai — Scene 3–4 và Scene 5.

---

## 0. Chuẩn bị trước khi bấm Record

### Thiết lập phần mềm

| Hạng mục | Thiết lập |
|---|---|
| Phần mềm quay | OBS Studio (hoặc ShareX / QuickTime) |
| Độ phân giải | 1920×1080 (1080p) — tối thiểu 1280×720 |
| FPS | 30 |
| Âm thanh | Chỉ mic. **Tắt nhạc nền.** Test mic trước 30 giây. |
| Cỡ chữ terminal | Phóng to ~18–20pt — người xem trên máy chiếu phải đọc được |
| Cỡ chữ VS Code | Zoom level 2–3 (`Ctrl` + `=`) |
| Theme | Nền sáng, tương phản cao |

### Dọn màn hình

- Bật Do Not Disturb. Đóng Slack/Messenger/mail.
- Đóng mọi tab trình duyệt không liên quan. **Không để lộ thông tin cá nhân, token, email riêng.**
- Terminal `clear` sạch, đứng sẵn ở thư mục `eshop-e2e/`.

### Chạy trước để khỏi phải chờ khi quay

```bash
# Terminal A — backend EShop
cd eshop-sut/backend && PORT=3001 node server.js

# Terminal B — frontend EShop
cd eshop-sut/frontend-web && npm run dev

# Terminal C — terminal sẽ lên hình. Chạy nháp 1 lần cho cache nóng:
cd eshop-e2e && API_URL=http://localhost:3001 npx playwright test tests/login.spec.ts -g "TC-L1"
```

> **Mẹo:** lần chạy đầu của Playwright luôn chậm. Chạy nháp trước để lúc quay test bung ra nhanh, người xem không phải ngồi nhìn màn hình đứng im.

### Bản dự phòng

Brief bắt buộc có **bản ghi dự phòng** phòng khi mạng/máy hỏng giữa buổi seminar. File quay xong chính là backup đó — đừng xoá sau khi nộp.

---

## 1. Bảng phân cảnh tổng quan

| # | Thời lượng | Mốc | Nội dung | Loại |
|---|---|---|---|---|
| 1 | 0:40 | 0:00–0:40 | Mở đầu + luận điểm | Nói |
| 2 | 0:50 | 0:40–1:30 | SUT + cài đặt Playwright | Traditional |
| 3 | 1:00 | 1:30–2:30 | Locator: dò DOM thật, test đầu tiên xanh | **Traditional** |
| 4 | 1:00 | 2:30–3:30 | Trace viewer: điều tra một test đỏ | **Traditional** |
| 5 | 1:15 | 3:30–4:45 | AI sinh test → chạy → fail → audit | **AI** |
| 6 | 1:00 | 4:45–5:45 | Bug bảo mật: UI xanh, backend nhận 1.000 ₫ | Oracle |
| 7 | 1:00 | 5:45–6:45 | Test xanh giả: chỉ khác đúng 1 dòng | Failure mode |
| 8 | 0:45 | 6:45–7:30 | Kết quả + bài học + kết | Nói |

---

## 2. Kịch bản chi tiết

### SCENE 1 — Mở đầu (0:00 – 0:40)

**Hình:** Slide tiêu đề gọn (tên nhóm, T02, Playwright + AI assistant), rồi cắt sang trang chủ EShop đang chạy ở `localhost:5173`.

**Lời thoại:**

> "Chào thầy và các bạn. Chúng em là nhóm 23KTPM1_02, đề tài T02 — Web Automation Testing.
> Công cụ truyền thống nhóm chọn là **Playwright**, còn hướng AI là dùng **AI coding assistant** để sinh test.
> Hệ thống được kiểm thử là **EShop**. Và đây là điểm mấu chốt: EShop **được cố ý cài lỗi sẵn** — chính README của nó nói vậy.
> Nên demo này không nhằm làm cho test xanh. Nó nhắm tới một điều khó hơn nhiều: **test xanh không có nghĩa là phần mềm đúng**. Chúng em sẽ chỉ ra ba cách mà công cụ này — và AI đặt lên trên nó — có thể đánh lừa chính người dùng nó."

**Ghi chú diễn:** Câu cuối là luận điểm xuyên suốt cả seminar. Nói chậm, nhấn rõ.

---

### SCENE 2 — SUT và cài đặt (0:40 – 1:30)

**Hình:** Chia đôi màn hình — terminal (backend + frontend đang chạy) và trình duyệt EShop.

**Thao tác:**
1. Trỏ vào 2 terminal đang chạy: backend `:3001`, frontend `:5173`.
2. Chuyển sang terminal C, gõ thật:

```bash
npx playwright --version
```

**Lời thoại:**

> "EShop gồm hai phần: backend Express và frontend React, cả hai đang chạy local.
> Bản thân Playwright chỉ cần hai lệnh để cài: `npm install -D @playwright/test`, rồi `npx playwright install chromium`. Nhóm đang dùng bản 1.61.1 trên Node 22.
> Một lưu ý cho ai chạy Linux: cờ `--with-deps` mà tài liệu khuyến nghị cần quyền root. Trên máy nhóm nó báo lỗi *'sudo: a terminal is required to authenticate'* rồi cài hỏng. Bỏ cờ đó đi thì chạy bình thường."

---

### SCENE 3 — Traditional #1: Locator và auto-wait (1:30 – 2:30)

**Hình:** Trình duyệt mở `localhost:5173/login`, phóng to form đăng nhập.

**Thao tác:**
1. Chỉ vào tiêu đề trang: nó ghi **"Đăng Ký"** — trên trang *đăng nhập*.
2. Chỉ vào nhãn **"Username"**, và nút **"Sign In"**.
3. Gõ mật khẩu vào ô password — **nó hiện rõ nguyên văn**. Dừng lại 2 giây cho người xem kịp thấy.
4. Cắt sang VS Code, mở `tests/probe.spec.ts`, chạy:

```bash
API_URL=http://localhost:3001 npx playwright test tests/probe.spec.ts
```

5. Dừng ở output thật:

```
số thẻ h1          : 0
getByLabel(Username): 0
số textbox          : 2
các nút             : [ 'Sign In' ]
```

6. Mở `pages/LoginPage.ts`, chỉ vào locator thật, rồi chạy test đầu tiên:

```bash
API_URL=http://localhost:3001 npx playwright test tests/login.spec.ts -g "TC-L1"
```

→ `1 passed`.

**Lời thoại:**

> "Trước khi viết bất kỳ locator nào, nhóm đi dò DOM thật. Và hãy nhìn kỹ đây.
> Tiêu đề trang đăng nhập lại ghi **'Đăng Ký'**. Ô email thì gắn nhãn **'Username'**. Nút bấm ghi **'Sign In'**. Và nhìn ô mật khẩu — mật khẩu **hiện rõ nguyên văn trên màn hình**, vì input là `type=text` chứ không phải `type=password`.
> Giờ xem kết quả dò DOM: `getByLabel('Username')` khớp **0 phần tử**. Bằng không — dù mắt ta đọc rõ mồn một chữ 'Username'. Vì sao? Vì thẻ `<label>` không có thuộc tính `for`, cũng không bọc input, nên nó không phải là nhãn hợp lệ. Playwright tuân theo chuẩn accessibility, nên nó không thấy gì cả.
> Đây là bài học đầu tiên: **locator chuẩn sách vở trở nên vô dụng trên một trang bị lỗi**. Nhóm buộc phải neo theo vị trí trong form — và chính sự yếu ớt đó là *bằng chứng của defect*, chứ không phải một lựa chọn thiết kế đẹp.
> Với locator đúng, test đầu tiên chạy xanh trong chưa tới một giây. Và để ý: trong toàn bộ code của nhóm **không có lấy một lệnh `sleep`** nào. Auto-wait của Playwright lo hết."

---

### SCENE 4 — Traditional #2: Trace viewer (2:30 – 3:30)

**Hình:** Terminal, chạy test add-to-cart bị fail.

**Thao tác:**
1. Chạy:

```bash
API_URL=http://localhost:3001 npx playwright test tests/add-to-cart.spec.ts -g "TC-C2"
```

2. Test **fail**. Đọc lỗi trên màn hình: `Expected: 1, Received: 0`.
3. Mở trace:

```bash
npx playwright show-trace test-results/<thư-mục-test-C2>/trace.zip
```

4. Trong Trace Viewer: tua từng action, chỉ vào **DOM snapshot trước và sau** cú click — giỏ hàng vẫn rỗng.
5. Cắt sang `ProductDetail.jsx`, chỉ thẳng vào đoạn code thật:

```jsx
if (clickCount === 0) {
  setClickCount(1);
  return; // Không làm gì cả ở lần đầu tiên
}
```

**Lời thoại:**

> "Đây là một test đang fail. Test bấm 'Thêm vào giỏ hàng' **đúng một lần**, rồi kiểm tra giỏ. Nó fail: mong đợi một dòng, nhận về không dòng nào.
> Thay vì ngồi đoán, nhóm mở **trace viewer** — theo nhóm đây là tính năng mạnh nhất của Playwright. Ta tua lại từng hành động, kèm ảnh chụp DOM trước và sau mỗi bước, cùng network và console.
> Cú click đã vào. Giỏ hàng vẫn rỗng. Và đây là lý do — trong source trang chi tiết sản phẩm, **cú click đầu tiên bị nuốt một cách cố ý**. Người dùng phải bấm hai lần mới thêm được hàng.
> Bây giờ, cách sửa đầy cám dỗ là cho test bấm luôn hai lần rồi đi tiếp. **Đừng.** Đó chính là cách một lỗi UX thật biến mất vĩnh viễn khỏi báo cáo. Test đang đúng. Sản phẩm mới là thứ sai."

---

### SCENE 5 — AI: sinh test, chạy, và audit (3:30 – 4:45)

**Hình:** VS Code, mở panel AI assistant (Copilot / Claude / Codex).

**Thao tác:**
1. Gõ prompt **thật, trực tiếp trên màn hình** — đây chính là "AI feature" mà brief bắt buộc:

```
Viết test Playwright cho FR-02 của EShop: người dùng đăng nhập bằng
test@eshop.com / Test1234!, sai mật khẩu 3 lần thì tài khoản bị khoá 30 giây.
```

2. Để AI sinh code. Nó sẽ ra đại loại thế này:

```ts
await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();
await page.getByLabel('Email').fill('test@eshop.com');
await page.getByLabel('Mật khẩu').fill('Test1234!');
await page.getByRole('button', { name: 'Đăng nhập' }).click();
```

3. Chạy thẳng bản AI draft (file nhóm đã lưu, **giữ nguyên không sửa** làm tang chứng):

```bash
API_URL=http://localhost:3001 npx playwright test tests/ai-draft/
```

4. **Cả 2 test đều fail.** Chỉ vào **cả hai** lỗi trên màn hình — chúng là hai kiểu sai khác nhau của cùng một nguyên nhân:

```
# Test 1 - AI đoán sai tiêu đề trang (trang login lại ghi "Đăng Ký")
Error: expect(locator).toBeVisible() failed
Call log:
  - waiting for getByRole('heading', { name: 'Đăng nhập' })

# Test 2 - AI đoán sai nhãn ô nhập (nhãn thật là "Username", lại còn không gắn for/id)
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Email')
```

> ⚠️ **Lưu ý khi quay:** chạy cả thư mục thì **lỗi heading của test 1 hiện trước**, lỗi `getByLabel` của test 2 hiện sau. Đọc lời thoại theo đúng thứ tự đó. Nếu chỉ muốn khoe đúng lỗi `getByLabel`, chạy riêng:
> ```bash
> API_URL=http://localhost:3001 npx playwright test tests/ai-draft/ -g "khóa tài khoản"
> ```
> (test này mất 31 giây vì timeout — cân nhắc tua nhanh phần chờ, nhưng **không được cắt ghép giả kết quả**.)

**Lời thoại:**

> "Giờ tới phần AI. Nhóm nhờ AI assistant viết hộ test đăng nhập. Code nó sinh ra trông **chuẩn không chê vào đâu được**: `getByLabel('Email')`, heading 'Đăng nhập', nút tên 'Đăng nhập'.
> Nhóm chạy thử. **Cả hai test đều fail.** Test đầu chết vì nó chờ một tiêu đề tên 'Đăng nhập' — mà trang login thật lại ghi 'Đăng Ký'. Test sau chết vì timeout ba mươi giây trong lúc chờ `getByLabel('Email')` — nhãn thật là 'Username', và nhãn đó còn chẳng gắn được vào ô nhập.
> Chuyện đã xảy ra là: AI viết test dựa trên **đặc tả**. Nó chưa từng nhìn vào DOM thật. Nó mặc định thế giới đúng y như tài liệu mô tả — mà EShop lại chính là hệ thống KHÔNG như vậy.
> Và đây mới là khoảnh khắc nguy hiểm nhất. Phản xạ tự nhiên là dán lỗi trả lại cho AI rồi bảo 'sửa đi'. AI sẽ vui vẻ *sửa* — bằng cách đổi heading mong đợi thành 'Đăng Ký', đổi tên nút thành 'Sign In'. Test lập tức chuyển xanh — và bộ test của bạn vừa **chính thức công nhận toàn bộ đống bug này là hành vi đúng**.
> Nên quy tắc nhóm tuân theo là: khi test đỏ, phải xác định *vì sao đỏ*. Nếu DOM mâu thuẫn với đặc tả thì đó là **defect** — ghi vào bug report. **Chỉ sửa locator. Tuyệt đối không nới lỏng assertion.**"

**Ghi chú diễn:** Scene này chấm điểm nặng nhất (brief đòi chỉ rõ "AI có thể gây hiểu nhầm"). Nói dứt khoát, đừng vội.

---

### SCENE 6 — UI xanh, nghiệp vụ hỏng (4:45 – 5:45)

**Hình:** Trình duyệt, đi qua flow checkout thật bằng tay.

**Thao tác:**
1. Đăng nhập, thêm **iPhone 15 Pro Max (30.000.000 ₫)** vào giỏ, bấm thanh toán.
2. Ở trang checkout: chỉ vào ô "Tổng tiền thanh toán" — **nó là một `<input type="number">` sửa được**.
3. Sửa `30000000` → `1000`. Bấm **Xác Nhận Thanh Toán**.
4. UI hiện to đùng **"Thanh toán thành công!"**. Dừng 2 giây.
5. Cắt sang terminal, chạy test TC-K4:

```bash
API_URL=http://localhost:3001 npx playwright test tests/checkout.spec.ts -g "TC-K4"
```

6. Dừng ở output thật:

```
Error: backend không được nhận tổng tiền do client gửi
Expected: 30000000
Received: 1000
```

**Lời thoại:**

> "Hãy xem kỹ đây. Một chiếc iPhone ba mươi triệu đồng. Trên trang thanh toán, ô tổng tiền lại là một **input số sửa được** — người dùng chỉ việc gõ đè lên. Em đổi nó thành **một nghìn đồng**, rồi bấm xác nhận.
> Giao diện báo: **'Thanh toán thành công!'** Xanh. Đẹp. Xong.
> Nếu test của nhóm chỉ kiểm tra giao diện — đúng y như bản do AI sinh ra — thì nó sẽ **PASS ngon lành**.
> Nên nhóm đặt oracle xuống **tầng dữ liệu**: hỏi thẳng API xem đơn hàng vừa tạo thực sự ghi bao nhiêu tiền. Mong đợi ba mươi triệu. **Nhận về một nghìn.** Backend đã chấp nhận cái giá do client gửi lên.
> Đó là một lỗ hổng bảo mật nghiêm trọng — và **mọi test chỉ nhìn giao diện đều mù trước nó**. Câu hỏi của người kiểm thử không bao giờ được phép là *'màn hình có hiện chữ thành công không?'*, mà phải là **'bằng chứng nào chứng minh nghiệp vụ đã đúng?'**"

---

### SCENE 7 — Test xanh giả (5:45 – 6:45)

**Hình:** VS Code, mở `tests/false-pass-demo.spec.ts` — hai test nằm cạnh nhau.

**Thao tác:**
1. Chỉ vào 2 test: chúng kiểm tra **cùng một yêu cầu FR-08**, trên **cùng một SUT**.
2. Chỉ ra khác biệt duy nhất — **một dòng neo trạng thái**:

```ts
await expect(page.getByRole('button', { name: 'Xác Nhận Thanh Toán' })).toBeVisible();  // NEO
```

3. Chạy:

```bash
API_URL=http://localhost:3001 npx playwright test tests/false-pass-demo.spec.ts
```

4. Kết quả thật: **1 passed, 1 failed**.

**Lời thoại:**

> "Điều cuối cùng — và đây là thứ khiến nhóm bất ngờ nhất.
> Ai cũng tin rằng 'Playwright có auto-wait nên khỏi lo timing'. **Điều đó không đúng với assertion phủ định.**
> Hai test này kiểm tra **cùng một yêu cầu**, trên **cùng một hệ thống**. Khác biệt duy nhất là một dòng: test thứ hai **neo** vào việc trang thanh toán đã render xong, rồi mới assert.
> Chạy cả hai: **một cái xanh, một cái đỏ.**
> Cái xanh là một **lời nói dối**. `toHaveCount(0)` được thoả mãn ngay ở lần kiểm tra đầu tiên — ở khoảnh khắc đó ứng dụng còn chưa kịp chuyển trang, nên đương nhiên đếm được không có input nào. Nó đúng về mặt kỹ thuật, và hoàn toàn vô giá trị. Nó **bỏ lọt defect** trong im lặng.
> Vậy nên: trước mọi assertion phủ định, hãy **neo vào một thứ chắc chắn phải tồn tại** ở trạng thái đích. Nếu không, bạn chỉ đang chứng minh rằng *trang cũ* không có thứ đó mà thôi."

---

### SCENE 8 — Kết quả và bài học (6:45 – 7:30)

**Hình:** HTML report (`npx playwright show-report`) — hiện rõ **23 tests · 8 passed · 15 failed**. Cuộn chậm qua danh sách test đỏ.

**Lời thoại:**

> "Bộ test đầy đủ của nhóm: hai mươi ba test, tám xanh, mười lăm đỏ — chạy hết bốn mươi giây.
> Và **mỗi một test đỏ đều truy ngược về một defect thật**: mật khẩu hiện nguyên văn; tài khoản bị khoá ngay sau hai lần sai thay vì ba, vì bộ đếm tăng hai đơn vị mỗi lần; nút thêm vào giỏ phải bấm hai lần; giỏ hàng không được xoá sau khi thanh toán; và cái lỗ hổng sửa giá mà các bạn vừa thấy.
> Ba điều nhóm rút ra.
> **Một — locator bám DOM, assertion bám đặc tả.** Trộn lẫn hai thứ đó thì bộ test của bạn sẽ vui vẻ chứng nhận cho chính những con bug cần tìm.
> **Hai — đặt oracle ở nơi có sự thật.** Giao diện không phải là sự thật.
> **Ba — AI viết test rất nhanh, nhưng AI không phải test oracle.** Nó mặc định thế giới đúng như tài liệu. Việc của người kiểm thử là đi kiểm chứng xem điều đó có thật hay không.
> Cảm ơn thầy và các bạn đã theo dõi."

---

## 3. Sau khi quay

### Checklist trước khi nộp

- [ ] Thời lượng nằm trong **5:00 – 8:00** (đích 7:30).
- [ ] 1080p (tối thiểu 720p), chữ trên terminal đọc được khi chiếu.
- [ ] **Không nhạc nền.** Tiếng nói rõ, không rè.
- [ ] Có ít nhất 1 tính năng Playwright (Scene 3, 4) **và** 1 tính năng AI (Scene 5).
- [ ] Terminal/IDE **thật** — không dựng, không giả lập kết quả.
- [ ] File **≤ 100 MB** (nếu lớn hơn phải split-zip).
- [ ] Không lộ thông tin cá nhân, email riêng, token trên màn hình.

### Nén nếu vượt 100 MB

```bash
ffmpeg -i demo_raw.mp4 -vcodec libx264 -crf 26 -preset slow -acodec aac -b:a 128k Demo_Screencast.mp4
ls -lh Demo_Screencast.mp4
```

`-crf` càng cao thì file càng nhỏ (23 = chất lượng tốt, 28 = nhỏ gọn). Với screencast nhiều chữ, `crf 26` thường vẫn đọc rõ.

### Phụ đề

Khuyến khích (không bắt buộc): xuất `.srt` nộp kèm, hoặc burn-in vào video. Người ngồi cuối lớp sẽ cảm ơn bạn.

---

## 4. Phân vai khi quay

| Vai | Việc |
|---|---|
| **Demoer** | Gõ lệnh, thao tác chuột. Không nói. |
| **Presenter** | Đọc lời thoại. Không chạm máy. |
| **Timekeeper** | Bấm giờ từng scene, nhắc "còn 15 giây" nếu lố. |
| **Facilitator** | Xem lại bản nháp, soát thuật ngữ, dựng cắt. |

> Brief nói rõ: **mọi thành viên phải tự demo được công cụ mà không cần trợ giúp.** Quay xong, mỗi người nên chạy lại toàn bộ flow ít nhất một lần.
