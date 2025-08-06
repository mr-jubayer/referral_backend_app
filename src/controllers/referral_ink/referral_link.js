import { asyncHandler } from "../../utils/asyncHandler.js";

const referralLink = asyncHandler(async (req, res) => {
  const { refId } = req.params;

  // Your app's custom scheme for deep linking
  const appDeepLink = `myapp://register?ref=${refId}`;

  // Fallback URLs for app stores
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.aswdc_iq_quiz&hl=en";
  const appStoreUrl = "https://apps.apple.com/app/idYOUR_APP_ID";

  // Simple user-agent detection for Android / iOS
  const ua = req.headers["user-agent"] || "";
  const isAndroid = ua.includes("Android");
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  // Fallback URL depends on platform
  let fallbackUrl;

  if (isAndroid) {
    fallbackUrl = playStoreUrl;
  } else if (isIOS) {
    fallbackUrl = appStoreUrl;
  } else {
    fallbackUrl = "https://yourapp.com";
  }

  // HTML page tries to open appDeepLink,
  // if fails after 2 seconds, redirects to fallbackUrl
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Opening App...</title>
        <script>
          function openApp() {
            // Try to open the app
            window.location = "${appDeepLink}";

            // After 2 seconds, redirect to fallback store page
            setTimeout(() => {
              window.location = "${fallbackUrl}";
            }, 2000);
          }
          window.onload = openApp;
        </script>
      </head>
      <body>
        <p>If your app does not open automatically, <a href="${fallbackUrl}">click here to install</a>.</p>
      </body>
    </html>
  `);
});

export { referralLink };
