export default function handler(req, res) {
  res.json({
    hasCookiePayKey: !!process.env.COOKIEPAY_API_ID && !!process.env.COOKIEPAY_API_KEY,
    cookiePayMode: process.env.COOKIEPAY_MODE ?? "sandbox",
  });
}
