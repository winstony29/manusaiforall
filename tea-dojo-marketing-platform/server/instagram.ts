/**
 * Instagram API Integration
 * 
 * This module handles Instagram API authentication and content publishing
 * using the Instagram API with Instagram Login (Business Login for Instagram).
 * 
 * Required Environment Variables:
 * - INSTAGRAM_APP_ID: Your Instagram App ID from Meta App Dashboard
 * - INSTAGRAM_APP_SECRET: Your Instagram App Secret from Meta App Dashboard
 * - INSTAGRAM_REDIRECT_URI: OAuth callback URL (e.g., https://your-domain.com/api/instagram/callback)
 */

import axios from 'axios';

// Types
export interface InstagramCredentials {
  accessToken: string;
  userId: string;
  expiresAt: Date;
  permissions: string[];
}

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
  permissions?: string;
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramContainerResponse {
  id: string;
}

export interface InstagramPublishResponse {
  id: string;
}

export interface InstagramContainerStatus {
  status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
}

export interface InstagramUserInfo {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
  name?: string;
  profile_picture_url?: string;
  biography?: string;
}

// In-memory token storage (replace with database in production)
const tokenStore = new Map<string, InstagramCredentials>();

/**
 * Get the Instagram OAuth authorization URL
 */
export function getAuthorizationUrl(state?: string): string {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  
  if (!appId || !redirectUri) {
    throw new Error('Instagram API credentials not configured. Please set INSTAGRAM_APP_ID and INSTAGRAM_REDIRECT_URI environment variables.');
  }
  
  const authUrl = new URL('https://www.instagram.com/oauth/authorize');
  authUrl.searchParams.append('client_id', appId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'instagram_business_basic,instagram_business_content_publish');
  
  if (state) {
    authUrl.searchParams.append('state', state);
  }
  
  return authUrl.toString();
}

/**
 * Exchange authorization code for short-lived access token
 */
export async function exchangeCodeForToken(code: string): Promise<InstagramTokenResponse> {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  
  if (!appId || !appSecret || !redirectUri) {
    throw new Error('Instagram API credentials not configured');
  }
  
  const formData = new URLSearchParams();
  formData.append('client_id', appId);
  formData.append('client_secret', appSecret);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', redirectUri);
  formData.append('code', code);
  
  const response = await axios.post<{ data: InstagramTokenResponse[] }>(
    'https://api.instagram.com/oauth/access_token',
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  // The response contains a data array with the token info
  if (response.data.data && response.data.data.length > 0) {
    return response.data.data[0];
  }
  
  throw new Error('Invalid token response from Instagram');
}

/**
 * Exchange short-lived token for long-lived token (valid for 60 days)
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<InstagramLongLivedTokenResponse> {
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  
  if (!appSecret) {
    throw new Error('Instagram App Secret not configured');
  }
  
  const response = await axios.get<InstagramLongLivedTokenResponse>(
    'https://graph.instagram.com/access_token',
    {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: shortLivedToken,
      },
    }
  );
  
  return response.data;
}

/**
 * Refresh a long-lived token before it expires
 */
export async function refreshLongLivedToken(token: string): Promise<InstagramLongLivedTokenResponse> {
  const response = await axios.get<InstagramLongLivedTokenResponse>(
    'https://graph.instagram.com/refresh_access_token',
    {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: token,
      },
    }
  );
  
  return response.data;
}

/**
 * Store Instagram credentials (in-memory for now)
 */
export function storeCredentials(sessionId: string, credentials: InstagramCredentials): void {
  tokenStore.set(sessionId, credentials);
}

/**
 * Get stored Instagram credentials
 */
export function getCredentials(sessionId: string): InstagramCredentials | undefined {
  return tokenStore.get(sessionId);
}

/**
 * Check if credentials exist and are valid
 */
export function hasValidCredentials(sessionId: string): boolean {
  const credentials = tokenStore.get(sessionId);
  if (!credentials) return false;
  
  // Check if token is expired (with 1 day buffer)
  const bufferTime = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  return new Date(credentials.expiresAt).getTime() > Date.now() + bufferTime;
}

/**
 * Get Instagram user information
 */
export async function getUserInfo(accessToken: string, userId: string): Promise<InstagramUserInfo> {
  const response = await axios.get<InstagramUserInfo>(
    `https://graph.instagram.com/${userId}`,
    {
      params: {
        fields: 'id,username,account_type,media_count,followers_count,follows_count,name,profile_picture_url,biography',
        access_token: accessToken,
      },
    }
  );
  
  return response.data;
}

/**
 * Create an image media container
 */
export async function createImageContainer(
  accessToken: string,
  userId: string,
  imageUrl: string,
  caption?: string
): Promise<InstagramContainerResponse> {
  const params: Record<string, string> = {
    image_url: imageUrl,
    access_token: accessToken,
  };
  
  if (caption) {
    params.caption = caption;
  }
  
  const response = await axios.post<InstagramContainerResponse>(
    `https://graph.instagram.com/${userId}/media`,
    null,
    { params }
  );
  
  return response.data;
}

/**
 * Create a video/reel media container
 */
export async function createVideoContainer(
  accessToken: string,
  userId: string,
  videoUrl: string,
  mediaType: 'REELS' | 'VIDEO' = 'REELS',
  caption?: string,
  coverUrl?: string
): Promise<InstagramContainerResponse> {
  const params: Record<string, string> = {
    video_url: videoUrl,
    media_type: mediaType,
    access_token: accessToken,
  };
  
  if (caption) {
    params.caption = caption;
  }
  
  if (coverUrl) {
    params.cover_url = coverUrl;
  }
  
  const response = await axios.post<InstagramContainerResponse>(
    `https://graph.instagram.com/${userId}/media`,
    null,
    { params }
  );
  
  return response.data;
}

/**
 * Check container status (for videos that need processing)
 */
export async function getContainerStatus(
  accessToken: string,
  containerId: string
): Promise<InstagramContainerStatus> {
  const response = await axios.get<InstagramContainerStatus>(
    `https://graph.instagram.com/${containerId}`,
    {
      params: {
        fields: 'status_code,status',
        access_token: accessToken,
      },
    }
  );
  
  return response.data;
}

/**
 * Wait for container to be ready (for videos)
 */
export async function waitForContainerReady(
  accessToken: string,
  containerId: string,
  maxAttempts: number = 30,
  intervalMs: number = 10000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getContainerStatus(accessToken, containerId);
    
    if (status.status_code === 'FINISHED') {
      return true;
    } else if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
      throw new Error(`Container processing failed: ${status.status || status.status_code}`);
    }
    
    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error('Container processing timeout - video may be too large or in unsupported format');
}

/**
 * Publish a media container
 */
export async function publishContainer(
  accessToken: string,
  userId: string,
  containerId: string
): Promise<InstagramPublishResponse> {
  const response = await axios.post<InstagramPublishResponse>(
    `https://graph.instagram.com/${userId}/media_publish`,
    null,
    {
      params: {
        creation_id: containerId,
        access_token: accessToken,
      },
    }
  );
  
  return response.data;
}

/**
 * Full publish flow for an image
 */
export async function publishImage(
  accessToken: string,
  userId: string,
  imageUrl: string,
  caption?: string
): Promise<InstagramPublishResponse> {
  // Step 1: Create container
  const container = await createImageContainer(accessToken, userId, imageUrl, caption);
  
  // Step 2: Publish container (images don't need processing wait)
  const published = await publishContainer(accessToken, userId, container.id);
  
  return published;
}

/**
 * Full publish flow for a video/reel
 */
export async function publishVideo(
  accessToken: string,
  userId: string,
  videoUrl: string,
  caption?: string,
  mediaType: 'REELS' | 'VIDEO' = 'REELS',
  coverUrl?: string
): Promise<InstagramPublishResponse> {
  // Step 1: Create container
  const container = await createVideoContainer(accessToken, userId, videoUrl, mediaType, caption, coverUrl);
  
  // Step 2: Wait for video processing
  await waitForContainerReady(accessToken, container.id);
  
  // Step 3: Publish container
  const published = await publishContainer(accessToken, userId, container.id);
  
  return published;
}

/**
 * Get content publishing limit status
 */
export async function getPublishingLimit(accessToken: string, userId: string): Promise<{
  quota_usage: number;
  config: {
    quota_total: number;
    quota_duration: number;
  };
}> {
  const response = await axios.get(
    `https://graph.instagram.com/${userId}/content_publishing_limit`,
    {
      params: {
        fields: 'quota_usage,config',
        access_token: accessToken,
      },
    }
  );
  
  return response.data;
}
