<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Strict rules
- Luôn luôn suy nghĩ và phản hồi chat bằng Tiếng Việt trong cả agent mode, ask mode và plan mode.
- Khi chạy lệnh trên terminal và gặp lỗi, bạn có thể tiếp tục fix thử cách khác. Tuy nhiên nếu sau 3 lần chạy mà vẫn lỗi thì hãy cung cấp lệnh để tôi tự chạy trên terminal và đề xuất cho bạn cách fix lỗi.
- Sau khi hoàn thành một task, luôn chạy lệnh build. Nếu build thất bại, hãy fix các lỗi được trả ra từ terminal. Sau đó build lại, nếu tiếp tục build thất bại thì hãy sửa là build lại cho tới khi không còn lỗi nữa.
- Mỗi khi hoàn thành một task, ghi chi tiết công việc đã làm làm file agent_log.md ở root folder của project. Ở cuối mỗi log của task, thêm 1 commit message mô tả ngắn gọn những việc vừa làm để tôi commit vào git.