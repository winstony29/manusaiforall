# Instagram API Implementation Plan for Tea Dojo Marketing Platform

---

**Author:** Manus AI  
**Date:** January 31, 2026  
**Project:** Tea Dojo AI Marketing Platform - Instagram Integration

---

## 1.0 Executive Summary

This document provides a comprehensive implementation plan for integrating Instagram posting functionality into the Tea Dojo AI Marketing Platform. The integration will enable users to directly publish AI-generated content (images, videos, and captions) to their Instagram professional accounts with a single click.

The implementation leverages the **Instagram API with Instagram Login**, which allows Instagram professional accounts (Business or Creator accounts) to publish content without requiring a linked Facebook Page. This approach aligns with the project's goal of providing a streamlined user experience for content publishing.

---

## 2.0 Technical Overview

### 2.1 API Configuration Selection

Based on the Instagram Platform documentation, there are two API configurations available [1]:

| Component | Instagram API with Instagram Login | Instagram API with Facebook Login |
|---|---|---|
| **Access Token Type** | Instagram User | Facebook User or Page |
| **Authorization Type** | Business Login for Instagram | Facebook Login for Business |
| **Facebook Page Required** | No | Yes |
| **Content Publishing** | ✓ | ✓ |
| **Hashtag Search** | ✗ | ✓ |
| **Product Tagging** | ✗ | ✓ |

**Recommendation:** Use **Instagram API with Instagram Login** because it does not require a Facebook Page, simplifying the setup process for users who only have an Instagram presence.

### 2.2 Required Permissions

The following permissions (scopes) are required for content publishing [2]:

| Permission | Description |
|---|---|
| `instagram_business_basic` | Required for basic account access and user information |
| `instagram_business_content_publish` | Required for publishing images, videos, reels, and carousels |

### 2.3 API Endpoints

The implementation will use the following Instagram Graph API endpoints [3]:

| Endpoint | Method | Purpose |
|---|---|---|
| `https://www.instagram.com/oauth/authorize` | GET | Initiate OAuth authorization flow |
| `https://api.instagram.com/oauth/access_token` | POST | Exchange authorization code for short-lived token |
| `https://graph.instagram.com/access_token` | GET | Exchange short-lived token for long-lived token |
| `https://graph.instagram.com/refresh_access_token` | GET | Refresh long-lived token before expiration |
| `https://graph.instagram.com/{ig-user-id}/media` | POST | Create media container |
| `https://graph.instagram.com/{ig-user-id}/media_publish` | POST | Publish media container |
| `https://graph.instagram.com/{container-id}?fields=status_code` | GET | Check container publishing status |

---

## 3.0 Prerequisites and Setup

### 3.1 Meta App Dashboard Configuration

Before implementing the code, the following must be configured in the Meta App Dashboard:

1. **Create a Meta App** (if not already created)
   - Navigate to [developers.facebook.com](https://developers.facebook.com)
   - Create a new app of type "Business"
   - Note the App ID

2. **Add Instagram Product**
   - In the App Dashboard, click "Add Product"
   - Select "Instagram" and then "API setup with Instagram login"

3. **Configure Business Login Settings**
   - Navigate to **Instagram > API setup with Instagram login > Set up Instagram business login**
   - Note the **Instagram App ID** and **Instagram App Secret**
   - Add **OAuth Redirect URIs** (e.g., `https://your-domain.com/api/instagram/callback`)
   - Configure the **Embed URL** with required scopes

4. **Add Test Users** (for development)
   - Add the Instagram professional account as a test user in the App Dashboard

### 3.2 Instagram Account Requirements

The user's Instagram account must be:
- A **Professional Account** (Business or Creator)
- Converted from a personal account if necessary (Settings > Account > Switch to Professional Account)

---

## 4.0 Backend Implementation

### 4.1 Environment Variables

Add the following environment variables to the server configuration:

```env
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/instagram/callback
```

### 4.2 New API Endpoints

The following endpoints will be added to `server/index.ts`:

#### 4.2.1 Authentication Initiation Endpoint

```typescript
// GET /api/instagram/auth
// Redirects user to Instagram authorization page
app.get('/api/instagram/auth', (req, res) => {
  const authUrl = new URL('https://www.instagram.com/oauth/authorize');
  authUrl.searchParams.append('client_id', process.env.INSTAGRAM_APP_ID);
  authUrl.searchParams.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'instagram_business_basic,instagram_business_content_publish');
  
  res.redirect(authUrl.toString());
});
```

#### 4.2.2 OAuth Callback Endpoint

```typescript
// GET /api/instagram/callback
// Handles the OAuth callback and exchanges code for tokens
app.get('/api/instagram/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.redirect('/dashboard/generate?instagram_error=' + error);
  }
  
  try {
    // Step 1: Exchange code for short-lived token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code: code
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const { access_token: shortLivedToken, user_id } = tokenResponse.data.data[0];
    
    // Step 2: Exchange for long-lived token
    const longLivedResponse = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        access_token: shortLivedToken
      }
    });
    
    const longLivedToken = longLivedResponse.data.access_token;
    
    // Store token securely (implement secure storage)
    // For now, store in memory or session
    
    res.redirect('/dashboard/generate?instagram_connected=true');
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.redirect('/dashboard/generate?instagram_error=auth_failed');
  }
});
```

#### 4.2.3 Content Publishing Endpoint

```typescript
// POST /api/instagram/post
// Publishes content to Instagram
app.post('/api/instagram/post', async (req, res) => {
  const { mediaUrl, caption, mediaType } = req.body;
  
  // Retrieve stored access token and user ID
  const accessToken = /* retrieve from secure storage */;
  const igUserId = /* retrieve from secure storage */;
  
  try {
    // Step 1: Create media container
    const containerParams: any = {
      access_token: accessToken,
      caption: caption
    };
    
    if (mediaType === 'IMAGE') {
      containerParams.image_url = mediaUrl;
    } else if (mediaType === 'VIDEO' || mediaType === 'REELS') {
      containerParams.video_url = mediaUrl;
      containerParams.media_type = mediaType;
    }
    
    const containerResponse = await axios.post(
      `https://graph.instagram.com/${igUserId}/media`,
      containerParams
    );
    
    const containerId = containerResponse.data.id;
    
    // Step 2: Wait for container to be ready (for videos)
    if (mediaType === 'VIDEO' || mediaType === 'REELS') {
      await waitForContainerReady(containerId, accessToken);
    }
    
    // Step 3: Publish the container
    const publishResponse = await axios.post(
      `https://graph.instagram.com/${igUserId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken
      }
    );
    
    res.json({
      success: true,
      mediaId: publishResponse.data.id
    });
  } catch (error) {
    console.error('Instagram publish error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || 'Failed to publish'
    });
  }
});

// Helper function to wait for video container to be ready
async function waitForContainerReady(containerId: string, accessToken: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const statusResponse = await axios.get(
      `https://graph.instagram.com/${containerId}`,
      { params: { fields: 'status_code', access_token: accessToken } }
    );
    
    const status = statusResponse.data.status_code;
    
    if (status === 'FINISHED') {
      return true;
    } else if (status === 'ERROR') {
      throw new Error('Container processing failed');
    }
    
    // Wait 10 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  throw new Error('Container processing timeout');
}
```

### 4.3 Token Storage and Management

For production, implement secure token storage:

```typescript
interface InstagramCredentials {
  accessToken: string;
  userId: string;
  expiresAt: Date;
}

// Token storage (replace with database in production)
const tokenStore = new Map<string, InstagramCredentials>();

// Token refresh endpoint
app.post('/api/instagram/refresh-token', async (req, res) => {
  const currentToken = /* retrieve from storage */;
  
  try {
    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: currentToken
      }
    });
    
    // Update stored token
    // Token is valid for 60 days
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Token refresh failed' });
  }
});
```

---

## 5.0 Frontend Implementation

### 5.1 New Components

#### 5.1.1 Instagram Connection Status Component

Create a new component to display Instagram connection status:

```tsx
// client/src/components/InstagramStatus.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, CheckCircle, AlertCircle } from 'lucide-react';

interface InstagramStatusProps {
  onConnect: () => void;
  isConnected: boolean;
}

export function InstagramStatus({ onConnect, isConnected }: InstagramStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <Instagram className="w-5 h-5" />
      {isConnected ? (
        <span className="text-green-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Connected
        </span>
      ) : (
        <Button variant="outline" size="sm" onClick={onConnect}>
          Connect Instagram
        </Button>
      )}
    </div>
  );
}
```

#### 5.1.2 Post to Instagram Button

Add to the ContentGeneration page:

```tsx
// In ContentGeneration.tsx - Add to the generated content section
<Button
  onClick={handlePostToInstagram}
  disabled={!isInstagramConnected || isPosting}
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
>
  {isPosting ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Posting...
    </>
  ) : (
    <>
      <Instagram className="w-4 h-4 mr-2" />
      Post to Instagram
    </>
  )}
</Button>
```

### 5.2 State Management Updates

Add the following state variables to `ContentGeneration.tsx`:

```tsx
const [isInstagramConnected, setIsInstagramConnected] = useState(false);
const [isPosting, setIsPosting] = useState(false);
const [postResult, setPostResult] = useState<{ success: boolean; message: string } | null>(null);

// Check connection status on mount
useEffect(() => {
  const checkInstagramConnection = async () => {
    try {
      const response = await fetch('/api/instagram/status');
      const data = await response.json();
      setIsInstagramConnected(data.connected);
    } catch (error) {
      console.error('Failed to check Instagram status:', error);
    }
  };
  
  checkInstagramConnection();
  
  // Check URL params for OAuth callback result
  const params = new URLSearchParams(window.location.search);
  if (params.get('instagram_connected') === 'true') {
    setIsInstagramConnected(true);
    toast.success('Instagram account connected successfully!');
  } else if (params.get('instagram_error')) {
    toast.error('Failed to connect Instagram account');
  }
}, []);
```

### 5.3 Posting Logic

```tsx
const handlePostToInstagram = async () => {
  if (!generatedContent.instagram.caption) {
    toast.error('No content to post');
    return;
  }
  
  setIsPosting(true);
  
  try {
    // Note: The image URL must be publicly accessible
    // You may need to upload the image to a public server first
    const response = await fetch('/api/instagram/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaUrl: uploadedImageUrl, // Must be publicly accessible
        caption: `${generatedContent.instagram.caption}\n\n${generatedContent.instagram.hashtags.join(' ')}`,
        mediaType: 'IMAGE'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Posted to Instagram successfully!');
      setPostResult({ success: true, message: 'Content published to Instagram' });
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    toast.error('Failed to post to Instagram');
    setPostResult({ success: false, message: error.message });
  } finally {
    setIsPosting(false);
  }
};
```

---

## 6.0 Media Hosting Considerations

The Instagram API requires media files to be hosted on a **publicly accessible URL**. The API will cURL the media from this URL during the publishing process [4].

### 6.1 Options for Media Hosting

| Option | Pros | Cons |
|---|---|---|
| **AWS S3** | Reliable, scalable, integrates well | Requires AWS setup, costs |
| **Cloudinary** | Easy to use, free tier available | Third-party dependency |
| **Self-hosted** | Full control | Requires server configuration |
| **Temporary hosting service** | Quick setup | May have limitations |

### 6.2 Recommended Approach

For the Tea Dojo platform, we recommend using **AWS S3** or **Cloudinary** for media hosting:

1. When the user generates an image, upload it to the hosting service
2. Obtain the public URL
3. Use this URL when calling the Instagram API

---

## 7.0 Content Specifications

### 7.1 Image Requirements [5]

| Specification | Requirement |
|---|---|
| **Format** | JPEG only |
| **File Size** | Maximum 8 MB |
| **Aspect Ratio** | 4:5 to 1.91:1 |
| **Minimum Width** | 320 pixels |
| **Maximum Width** | 1440 pixels |
| **Color Space** | sRGB (auto-converted) |

### 7.2 Video/Reel Requirements [5]

| Specification | Requirement |
|---|---|
| **Container** | MOV or MP4 |
| **Video Codec** | HEVC or H264 |
| **Audio Codec** | AAC, 48kHz max |
| **Frame Rate** | 23-60 FPS |
| **Max Resolution** | 1920 horizontal pixels |
| **Aspect Ratio** | 0.01:1 to 10:1 (9:16 recommended) |
| **Duration** | 3 seconds to 15 minutes |
| **File Size** | Maximum 300 MB |

### 7.3 Caption Requirements

| Specification | Limit |
|---|---|
| **Maximum Characters** | 2,200 |
| **Maximum Hashtags** | 30 |
| **Maximum @ Mentions** | 20 |

---

## 8.0 Rate Limits

The Instagram API enforces the following rate limits [6]:

| Limit Type | Value |
|---|---|
| **Published Posts** | 50 posts per 24-hour rolling period |
| **API-Published Posts** | 100 posts per 24-hour rolling period |
| **Container Creation** | 400 containers per 24-hour rolling period |
| **Container Expiration** | 24 hours |

---

## 9.0 Error Handling

### 9.1 Common Error Codes

| Error Code | Description | Resolution |
|---|---|---|
| `OAuthException` | Authentication failed | Re-authenticate user |
| `INVALID_LOCATION_ID` | Invalid location tag | Remove or correct location |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Implement backoff strategy |
| `MEDIA_PROCESSING_FAILED` | Media processing error | Check media specifications |

### 9.2 Error Handling Strategy

```typescript
// Implement retry logic with exponential backoff
async function publishWithRetry(params, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await publishToInstagram(params);
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## 10.0 Security Considerations

1. **Never expose the Instagram App Secret** in client-side code
2. **Store access tokens securely** (encrypted in database)
3. **Implement CSRF protection** using the `state` parameter in OAuth
4. **Validate all user inputs** before sending to the API
5. **Use HTTPS** for all API communications
6. **Implement token refresh** before expiration (60 days)

---

## 11.0 Implementation Timeline

| Phase | Tasks | Duration |
|---|---|---|
| **Phase 1** | Meta App Dashboard setup, environment configuration | 1-2 days |
| **Phase 2** | Backend OAuth implementation | 2-3 days |
| **Phase 3** | Backend publishing endpoints | 2-3 days |
| **Phase 4** | Frontend UI components | 2-3 days |
| **Phase 5** | Media hosting integration | 1-2 days |
| **Phase 6** | Testing and debugging | 2-3 days |
| **Phase 7** | Documentation and deployment | 1-2 days |

**Total Estimated Time:** 11-18 days

---

## 12.0 Testing Checklist

- [ ] OAuth flow completes successfully
- [ ] Short-lived token exchange works
- [ ] Long-lived token exchange works
- [ ] Token refresh works
- [ ] Image posting works
- [ ] Video/Reel posting works
- [ ] Caption with hashtags posts correctly
- [ ] Error handling works as expected
- [ ] Rate limiting is respected
- [ ] Token storage is secure

---

## 13.0 References

[1] Instagram Platform Overview - https://developers.facebook.com/docs/instagram-platform/overview

[2] Instagram API with Instagram Login - https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login

[3] Business Login for Instagram - https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login

[4] Content Publishing Guide - https://developers.facebook.com/docs/instagram-platform/content-publishing

[5] IG User Media Reference - https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media

[6] Instagram Platform Rate Limits - https://developers.facebook.com/docs/instagram-platform/overview#rate-limiting

---

## 14.0 Next Steps

1. **Share Instagram Account Details:** Please provide the Instagram App ID, App Secret, and test account credentials to proceed with implementation.

2. **Configure Meta App Dashboard:** Set up the OAuth redirect URIs and business login settings.

3. **Choose Media Hosting Solution:** Decide on AWS S3, Cloudinary, or another solution for hosting media files.

4. **Begin Implementation:** Start with Phase 1 (Meta App Dashboard setup) and proceed through the phases.

---

*This document was prepared by Manus AI based on the official Instagram Platform documentation as of January 2026.*
