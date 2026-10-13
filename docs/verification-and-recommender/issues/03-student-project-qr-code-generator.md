# 03 — Student Project QR Code Generator & Export Modal

**What to build:** An interactive modal on the Student Projects page that generates a QR code linking to `https://<VITE_APP_URL>/verify/<verification_code>` and allows the student to download the QR image (PNG/SVG) to put on their CV or slides.

**Blocked by:** 02 — Public Verification Gateway Page & Route (`/verify/:verificationCode`).

**Status:** completed

- [x] "Xuất Mã QR Xác Thực" button displayed on verified projects in student's project list.
- [x] Modal displays QR Code rendered using `qrcode.react`, embedding the full public verification URL.
- [x] Includes "Tải mã QR (PNG)" button allowing the student to download the image file.
- [x] Verification URL uses environment variable `VITE_APP_URL` so it adapts to `localhost` in dev and production domain in deployment.
