

**Bài tập 60 phút**

**Chọn kiến trúc cho hệ thống đặt lịch dịch vụ**

# **1\. Mục tiêu**

Sau bài tập này, sinh viên cần biết:

* Phân biệt khi nào nên dùng **Monolith**, **Modular Monolith**, **Microservices**.  
* Biết rằng **microservices không phải lúc nào cũng tốt nhất**.  
* Biết phần nào nên xử lý trực tiếp, phần nào nên xử lý bằng **sự kiện**.  
* Biết phân tích lỗi thực tế thay vì chỉ vẽ kiến trúc đẹp.  
* Biết giải thích quyết định kiến trúc bằng lý do, không trả lời máy móc.

# **2\. Quy định sử dụng AI**

Sinh viên **được phép dùng AI** để:

* Hỏi nghĩa các khái niệm: Monolith, Modular Monolith, Microservices, Event, Broker, Mediator.  
* Hỏi ví dụ đơn giản để hiểu bài.  
* Hỏi sự khác nhau giữa xử lý đồng bộ và xử lý bằng sự kiện.

Sinh viên **không được dùng AI** để:

* Viết toàn bộ bài làm.  
* Tạo sẵn bảng phân tích hoàn chỉnh.  
* Chọn kiến trúc thay mình.  
* Copy nguyên văn câu trả lời của AI.

# **3\. Tình huống thực tế**

Một công ty nhỏ muốn xây dựng hệ thống **SmartBooking**.

Hệ thống này cho phép người dùng:

* Xem danh sách dịch vụ  
* Chọn ngày giờ đặt lịch  
* Đặt lịch  
* Thanh toán  
* Nhận email/SMS xác nhận  
* Nhân viên xem và xác nhận lịch  
* Quản trị viên xem báo cáo số lượng đơn đặt lịch

Ví dụ: người dùng đặt lịch sửa xe, khám bệnh, tư vấn tài chính hoặc học online.

Công ty hiện có:

* 5 lập trình viên  
* 1 DevOps bán thời gian  
* Cần ra sản phẩm đầu tiên trong 3 tháng  
* Dự kiến 10.000 người dùng trong 6 tháng đầu  
* Sau 1 năm có thể mở rộng thêm nhiều chi nhánh  
* Hệ thống chưa quá lớn, nhưng cần dễ mở rộng về sau

# **4\. Câu hỏi lớn của bài tập**

Nếu bạn là người thiết kế hệ thống, bạn sẽ chọn kiến trúc nào cho phiên bản đầu tiên?

Bạn có 3 lựa chọn:

1. **Monolith**  
2. **Modular Monolith**  
3. **Microservices**

Không có đáp án duy nhất đúng. Điểm cao phụ thuộc vào **lý do chọn**, **biết đánh đổi**, và **biết phân tích lỗi thực tế**.

# **5\. Sinh viên cần làm**

## **Phần A — Chọn kiến trúc tổng thể**

Hãy chọn **một kiến trúc chính** cho phiên bản đầu tiên của SmartBooking:

Em/nhóm em chọn kiến trúc: ...

Sau đó trả lời ngắn gọn:

4. Vì sao chọn kiến trúc này?  
5. Vì sao chưa chọn hai kiến trúc còn lại?  
6. Kiến trúc này có phù hợp với đội 5 lập trình viên và 1 DevOps bán thời gian không?  
7. Nếu hệ thống lớn lên sau 1 năm, phần nào có thể tách ra trước?

Gợi ý:

* **Monolith**: dễ làm nhanh, dễ deploy, nhưng khi lớn dễ rối.  
* **Modular Monolith**: vẫn là một ứng dụng, nhưng chia module rõ ràng.  
* **Microservices**: linh hoạt, dễ mở rộng, nhưng phức tạp hơn về vận hành, deployment, giao tiếp giữa service.

## **Phần B — Chia chức năng hệ thống**

Hãy chia SmartBooking thành các phần chính.

Sinh viên điền vào bảng sau:

| Phần chức năng | Nhiệm vụ chính | Có nên tách riêng ngay không? Vì sao? |
| :---- | :---- | :---- |
| Người dùng | Quản lý tài khoản, thông tin khách hàng |  |
| Dịch vụ | Quản lý danh sách dịch vụ |  |
| Đặt lịch | Tạo và quản lý lịch hẹn |  |
| Thanh toán | Xử lý giao dịch thanh toán |  |
| Thông báo | Gửi email/SMS |  |
| Nhân viên | Xem và xác nhận lịch |  |
| Báo cáo | Thống kê số lượng lịch đặt, doanh thu |  |

Yêu cầu quan trọng:

Không được trả lời kiểu:

“Tách tất cả thành microservices cho hiện đại.”

Sinh viên phải giải thích: phần nào thật sự cần tách, phần nào nên để chung lúc đầu.

## **Phần C — Luồng đặt lịch**

Hãy mô tả luồng đặt lịch từ lúc người dùng bấm “Đặt lịch” đến khi nhận thông báo.

Ví dụ dạng:

Người dùng chọn dịch vụ  
→ chọn ngày giờ  
→ hệ thống kiểm tra còn lịch trống  
→ tạo booking tạm  
→ thanh toán  
→ xác nhận booking  
→ gửi email/SMS  
→ cập nhật báo cáo

Sau đó, sinh viên phân loại:

| Bước xử lý | Nên xử lý ngay hay xử lý bằng sự kiện? | Lý do |
| :---- | :---- | :---- |
| Kiểm tra lịch trống | Xử lý ngay / Sự kiện |  |
| Tạo booking | Xử lý ngay / Sự kiện |  |
| Thanh toán | Xử lý ngay / Sự kiện |  |
| Gửi email/SMS | Xử lý ngay / Sự kiện |  |
| Cập nhật báo cáo | Xử lý ngay / Sự kiện |  |
| Ghi log/phân tích dữ liệu | Xử lý ngay / Sự kiện |  |

Gợi ý:

* Việc ảnh hưởng trực tiếp đến kết quả người dùng nhìn thấy thường nên xử lý ngay.  
* Việc phụ trợ như gửi email, cập nhật báo cáo, ghi log có thể xử lý bằng sự kiện.  
* Theo tài liệu EDA, kiến trúc hướng sự kiện giúp các thành phần giao tiếp bằng việc phát và tiêu thụ sự kiện, giúp giảm phụ thuộc và dễ mở rộng hơn.

## **Phần D — Dùng sự kiện như thế nào?**

Giả sử sau khi đặt lịch thành công, hệ thống phát ra sự kiện:

BookingConfirmed

Hãy cho biết những phần nào sẽ quan tâm đến sự kiện này.

Ví dụ:

| Sự kiện | Ai phát ra? | Ai nhận? | Nhận để làm gì? |
| :---- | :---- | :---- | :---- |
| BookingConfirmed | Booking | Notification | Gửi email/SMS |
| BookingConfirmed | Booking | Report | Cập nhật báo cáo |
| BookingConfirmed | Booking | Staff | Hiển thị lịch mới cho nhân viên |

Sinh viên cần thêm ít nhất **3 sự kiện khác**.

Gợi ý sự kiện:

BookingCreated  
PaymentSucceeded  
PaymentFailed  
BookingCancelled  
NotificationSent

## **Phần E — Chọn cách điều phối: đơn giản hay có người điều phối?**

Có hai cách dễ hiểu:

### **Cách 1: Phát sự kiện đơn giản**

Một phần xử lý xong thì phát sự kiện. Ai cần thì tự lắng nghe.

Ví dụ:

Booking Service phát BookingConfirmed  
→ Notification tự nghe và gửi SMS  
→ Report tự nghe và cập nhật báo cáo

Cách này giống **Broker topology** trong tài liệu: không có trung tâm điều phối, các bộ phận phản ứng với sự kiện thông qua broker.

### **Cách 2: Có một bộ phận điều phối**

Một bộ phận trung tâm điều khiển thứ tự các bước.

Ví dụ:

Booking Orchestrator  
→ yêu cầu giữ chỗ  
→ yêu cầu thanh toán  
→ nếu thanh toán thành công thì xác nhận booking  
→ nếu thất bại thì hủy booking tạm  
→ gửi thông báo

Cách này giống **Mediator topology** trong tài liệu: có thành phần trung gian điều phối workflow, phù hợp khi quy trình phức tạp.

Sinh viên trả lời:

8. Với SmartBooking giai đoạn đầu, bạn chọn cách nào?  
9. Vì sao?  
10. Nếu quy trình thanh toán phức tạp hơn, có nên dùng bộ phận điều phối không?  
11. Nếu chỉ gửi email và cập nhật báo cáo, có cần bộ phận điều phối không?

## **Phần F — Phân tích lỗi thực tế**

Chọn ít nhất **3 lỗi** dưới đây và phân tích.

| Tình huống lỗi | Hậu quả | Cách xử lý đề xuất |
| :---- | :---- | :---- |
| Thanh toán thành công nhưng booking chưa được xác nhận |  |  |
| Gửi email/SMS bị lỗi |  |  |
| Báo cáo chưa cập nhật kịp |  |  |
| Một sự kiện bị xử lý hai lần |  |  |
| Hệ thống thanh toán phản hồi chậm |  |  |
| Số lượng người dùng tăng đột biến |  |  |
| Một module bị lỗi làm ảnh hưởng phần khác |  |  |

Yêu cầu:

Không được chỉ viết:

“Retry lại.”

Phải nói rõ hơn:

* Retry ở bước nào?  
* Retry bao nhiêu lần?  
* Nếu vẫn lỗi thì làm gì?  
* Có cần lưu trạng thái không?  
* Có cần tránh xử lý trùng không?

Ví dụ trả lời tốt:

Nếu gửi email thất bại, booking không nên bị hủy vì booking đã thành công.  
Notification có thể retry 3 lần.  
Nếu vẫn lỗi thì đưa vào danh sách lỗi để nhân viên kiểm tra lại.  
Cần lưu trạng thái NotificationFailed để không mất dấu lỗi.

# **6\. Sản phẩm nộp**

Sinh viên nộp bài trong 2–3 trang, gồm:

12. Kiến trúc tổng thể đã chọn  
13. Lý do chọn và lý do không chọn các kiến trúc còn lại  
14. Bảng chia chức năng hệ thống  
15. Luồng đặt lịch  
16. Bảng xử lý ngay hay xử lý bằng sự kiện  
17. Danh sách sự kiện chính  
18. Phân tích ít nhất 3 lỗi thực tế  
19. Ghi rõ đã dùng AI như thế nào

Tài liệu tham khảo”

[https://mehmetozkaya.medium.com/comparing-monolith-microservices-and-modular-monoliths-communications-data-development-and-5ebf643191fd](https://mehmetozkaya.medium.com/comparing-monolith-microservices-and-modular-monoliths-communications-data-development-and-5ebf643191fd)

