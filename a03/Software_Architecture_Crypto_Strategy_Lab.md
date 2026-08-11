**BÀI TẬP 90 PHÚT – SOFTWARE ARCHITECTURE**

**Crypto Strategy Lab**

*Thời gian: 90 phút  |  Thang điểm: 10*

| Không cần viết code hoàn chỉnh. Có thể vẽ sơ đồ bằng tay. Quan trọng nhất là giải thích được: khi yêu cầu thay đổi, phần nào nên thay đổi, phần nào không nên thay đổi, và vì sao. |
| :---: |

**Yêu cầu đối với sinh viên**

* Tập trung **hiểu bản chất vấn đề và vận dụng kiến thức** để giải quyết bài tập, thay vì học thuộc hoặc chỉ ghi nhớ thuật ngữ.  
* Khi trình bày, ưu tiên thể hiện **quá trình tư duy, khả năng áp dụng và lý giải quyết định kiến trúc** hơn là sử dụng nhiều thuật ngữ hoặc công nghệ phức tạp.

**Tài liệu tham khảo:**  
 [https://drive.google.com/file/d/1psllgJeQWCH-FthF30kaPyIdv4wfYM9Y/view?usp=sharing](https://drive.google.com/file/d/1psllgJeQWCH-FthF30kaPyIdv4wfYM9Y/view?usp=sharing)

# **Tình huống**

Nhóm bạn đã xây dựng được hệ thống:

**Binance  →  Strategy  →  Backtest  →  Leaderboard  →  Web**

Hiện tại hệ thống có: MA Strategy, RSI Strategy, Random Search và chạy khoảng 100 backtests/lần. Hệ thống đang chạy tốt, nhưng khách hàng bắt đầu đưa ra các yêu cầu mới.

# **Câu 1 – Chia hệ thống như thế nào? (2 điểm)**

Một bạn đề nghị viết tất cả vào một TradingService: lấy dữ liệu Binance, tính MA/RSI, backtest, ranking, lưu database và gửi dữ liệu lên web.

**Yêu cầu:** Hãy chia lại thành các module/component hợp lý và vẽ một sơ đồ đơn giản. Sau đó giải thích vì sao cách chia của bạn tốt hơn một TradingService làm tất cả.

**Gợi ý tư duy:** Nếu Binance thay đổi API, phần nào nên thay đổi và phần nào không nên thay đổi?

# **Câu 2 – Ngày mai thêm MACD thì sao? (2 điểm)**

Hiện tại hệ thống có MA, RSI, Bollinger và Support/Resistance. Ngày mai khách hàng yêu cầu thêm MACD Strategy.

**Yêu cầu:** Hãy thiết kế để khi thêm MACD, không phải sửa Backtester, Evaluator và Leaderboard. Vẽ hoặc mô tả cách làm, rồi trả lời: điều gì trong thiết kế giúp thêm strategy mới mà ít ảnh hưởng code cũ?

**Lưu ý:** Không bắt buộc nhớ tên pattern. Giải thích đúng bản chất quan trọng hơn tên gọi.

# **Câu 3 – Từ 100 lên 100.000 backtests (3 điểm)**

Ban đầu luồng xử lý là: Generate Strategy → Backtest → Evaluate → Leaderboard. Với 100 strategy thì chạy ổn. Bây giờ cần thử 100.000 strategy candidates.

**Yêu cầu:** Hãy thay đổi kiến trúc để có thể xử lý nhiều backtest hơn và vẽ một luồng đơn giản.

Có thể suy nghĩ theo hướng: Generator → Queue → Workers → Evaluator → Leaderboard.

* a. Nếu từ 1 worker tăng thành 4 worker, phần nào của hệ thống không nên phải sửa?  
* b. Nếu một worker bị lỗi giữa lúc backtest, hệ thống nên xử lý job đó thế nào?

**Lưu ý:** Không bắt buộc dùng Kafka, Kubernetes hay Microservices. Quan trọng là cách chia công việc, scale và xử lý lỗi.

# **Câu 4 – Kiến trúc của bạn có thật sự tốt không? (3 điểm)**

Giảng viên nói: “Sơ đồ của em nhìn đẹp. Nhưng làm sao chứng minh kiến trúc thật sự tốt?”

**Chọn 2 trong 4 tình huống sau:**

* A. Thêm MACD Strategy  
* B. Random Search → Genetic Search  
* C. News Service bị tắt  
* D. Backtest Worker tăng từ 1 → 4

Với mỗi tình huống, trả lời 3 câu:

1. Bạn sẽ thử điều gì?  
2. Kết quả nào chứng minh kiến trúc tốt?  
3. Nếu điều gì xảy ra thì bạn kết luận kiến trúc đang có vấn đề?

# **Thang điểm**

| Câu | Nội dung | Điểm |
| :---- | :---- | :---- |
| 1 | Chia trách nhiệm | 2 |
| 2 | Khả năng mở rộng | 2 |
| 3 | Scale \+ failure | 3 |
| 4 | Kiểm chứng kiến trúc | 3 |
|  | **Tổng** | **10** |

