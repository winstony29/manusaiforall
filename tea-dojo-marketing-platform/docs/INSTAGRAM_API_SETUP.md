# Instagram API Integration Setup Guide

This guide walks you through setting up the Instagram API integration for the Tea Dojo Marketing Platform.

## Overview

The platform uses **Instagram API with Instagram Login** (Business Login for Instagram) to enable direct posting to Instagram. This approach:
- Does not require a Facebook Page
- Works with Instagram Business or Creator accounts
- Supports image and video (Reels) publishing

## Prerequisites

1. An Instagram Business or Creator account
2. A Meta Developer account
3. A Meta App configured with Instagram API

---

## Step 1: Create a Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "Get Started" and follow the registration process
3. Verify your account with a phone number

---

## Step 2: Create a Meta App

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Click **Create App**
3. Select **Other** as the use case
4. Select **Business** as the app type
5. Enter your app name (e.g., "Tea Dojo Marketing Platform")
6. Click **Create App**

---

## Step 3: Add Instagram API Product

1. In your app dashboard, find **Add Products to Your App**
2. Find **Instagram** and click **Set Up**
3. Select **Instagram API with Instagram Login**

---

## Step 4: Configure Instagram API Settings

### Basic Settings
1. Go to **App Settings** > **Basic**
2. Note down your:
   - **App ID** (this is your `INSTAGRAM_APP_ID`)
   - **App Secret** (this is your `INSTAGRAM_APP_SECRET`)

### Add OAuth Redirect URI
1. Go to **Instagram** > **API setup with Instagram login**
2. Under **OAuth Settings**, add your redirect URIs:
   - For local development: `http://localhost:5173/api/instagram/callback`
   - For production: `https://your-domain.com/api/instagram/callback`

### Configure Permissions
1. In the Instagram API settings, ensure these permissions are enabled:
   - `instagram_business_basic` - Required for authentication
   - `instagram_business_content_publish` - Required for posting content

---

## Step 5: Add Test Users

While your app is in Development mode, only test users can authenticate:

1. Go to **App Roles** > **Roles**
2. Click **Add People**
3. Add the Instagram account you want to test with
4. The user must accept the invitation from their Instagram app

---

## Step 6: Configure Environment Variables

Create a `.env` file in the `tea-dojo-marketing-platform` directory:

```env
# Instagram API Configuration
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_REDIRECT_URI=http://localhost:5173/api/instagram/callback

# OpenAI API (for content generation)
OPENAI_API_KEY=your_openai_api_key
```

---

## Step 7: Test the Integration

1. Start the development server:
   ```bash
   cd tea-dojo-marketing-platform
   pnpm dev
   ```

2. In another terminal, start the backend server:
   ```bash
   cd tea-dojo-marketing-platform
   pnpm tsx server/index.ts
   ```

3. Open the app at `http://localhost:5173`

4. Navigate to the Content Generation page

5. Click **Connect Instagram** in the top navigation

6. Authorize the app with your Instagram account

7. Generate content and test posting!

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/instagram/auth` | GET | Initiates OAuth flow (redirects to Instagram) |
| `/api/instagram/callback` | GET | Handles OAuth callback from Instagram |
| `/api/instagram/status` | GET | Returns connection status and user info |
| `/api/instagram/post` | POST | Publishes content to Instagram |
| `/api/instagram/disconnect` | POST | Disconnects the Instagram account |
| `/api/instagram/refresh-token` | POST | Refreshes the access token |
| `/api/instagram/publishing-limit` | GET | Returns current publishing quota |

### POST /api/instagram/post

Request body:
```json
{
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Your caption with #hashtags",
  "mediaType": "IMAGE"
}
```

Media types:
- `IMAGE` - Single image post
- `REELS` - Video/Reel post
- `VIDEO` - Video post (legacy)

---

## Media Requirements

### Images
- Format: JPEG only
- Max file size: 8MB
- Aspect ratio: Between 4:5 and 1.91:1
- Must be hosted on a publicly accessible URL

### Videos (Reels)
- Format: MP4, MOV
- Max file size: 1GB
- Duration: 3 seconds to 15 minutes
- Aspect ratio: 9:16 recommended for Reels
- Must be hosted on a publicly accessible URL

---

## Going to Production

### App Review
Before going live, you need to submit your app for review:

1. Go to **App Review** > **Permissions and Features**
2. Request access to:
   - `instagram_business_basic`
   - `instagram_business_content_publish`
3. Provide use case details and screencasts
4. Submit for review (typically takes 1-5 business days)

### Update Redirect URI
Update your `.env` file with your production domain:
```env
INSTAGRAM_REDIRECT_URI=https://your-production-domain.com/api/instagram/callback
```

### Token Management
- Access tokens expire after 60 days
- The app automatically exchanges short-lived tokens for long-lived ones
- Consider implementing a scheduled job to refresh tokens before expiry

---

## Troubleshooting

### "Instagram not configured" error
- Ensure `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` are set in your `.env` file
- Restart the server after adding environment variables

### OAuth callback fails
- Verify the redirect URI in Meta App Dashboard matches exactly
- Check that the user is added as a test user (in Development mode)

### "Media URL not accessible" error
- Ensure the image/video URL is publicly accessible (no authentication required)
- Instagram servers must be able to fetch the media directly

### Publishing fails
- Check the publishing limit with `/api/instagram/publishing-limit`
- Verify the media meets format requirements
- Ensure the caption doesn't exceed 2,200 characters

---

## Support

For issues with the Meta API:
- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-platform)
- [Meta Developer Support](https://developers.facebook.com/support/)

For issues with this integration:
- Check the server logs for detailed error messages
- Review the browser console for frontend errors
