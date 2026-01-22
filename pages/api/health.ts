export default function handler(req, res) {
  res.json({
    hasCookiePayKey: !!process.env.COOKIEPAY_API_KEY,
    hasCookiePayPay2Key: !!process.env.COOKIEPAY_PAY2_KEY,
    cookiePayMode: process.env.COOKIEPAY_MODE,
  });
}
