import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

// Initialize OpenAI client (uses OPENAI_API_KEY from environment)
const openai = new OpenAI();

// Types for the content generation
interface ThemeRequest {
  campaignGoal: string;
  targetAudience: string;
  toneOfVoice: string;
}

interface Theme {
  name: string;
  slogan: string;
  description: string;
  colors: string[];
  keyMessages: string[];
}

interface SocialContent {
  instagram: {
    caption: string;
    hashtags: string[];
  };
  facebook: {
    caption: string;
    hashtags: string[];
  };
  tiktok: {
    caption: string;
    hashtags: string[];
  };
}

interface VideoScript {
  title: string;
  duration: string;
  scenes: Array<{
    time: string;
    visual: string;
    audio: string;
    text: string;
  }>;
  callToAction: string;
}

interface ContentRequest {
  theme: Theme;
  campaignGoal: string;
  targetAudience: string;
  toneOfVoice: string;
}

// Generate campaign theme using LLM
app.post('/api/generate-theme', async (req, res) => {
  try {
    const { campaignGoal, targetAudience, toneOfVoice } = req.body as ThemeRequest;

    const prompt = `You are a creative marketing strategist for Tea Dojo, a bubble tea brand in Singapore. Generate a campaign theme based on the following:

Campaign Goal: ${campaignGoal}
Target Audience: ${targetAudience}
Tone of Voice: ${toneOfVoice}

Generate a JSON response with the following structure:
{
  "name": "Creative campaign name (e.g., 'Golden Fortune CNY 2026' or 'Summer Splash Festival')",
  "slogan": "Catchy slogan with 1-2 emojis",
  "description": "2-3 sentence description of the campaign theme, its visual style, and key messaging approach",
  "colors": ["#hexcode1", "#hexcode2", "#hexcode3"] (3 hex color codes that match the theme),
  "keyMessages": ["message1", "message2", "message3", "message4"] (4 key marketing messages)
}

Important:
- Make the theme specific to the campaign goal (e.g., if it's CNY, use red/gold colors and prosperity themes)
- If it's Christmas, use festive colors and holiday themes
- If it's summer, use bright refreshing colors
- Keep it relevant to a bubble tea brand in Singapore
- The slogan should be memorable and include relevant emojis

Respond ONLY with the JSON object, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative marketing expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    let responseText = completion.choices[0]?.message?.content || '';
    
    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const theme: Theme = JSON.parse(responseText);
    
    res.json({ success: true, theme });
  } catch (error) {
    console.error('Error generating theme:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate theme',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate social media content using LLM
app.post('/api/generate-content', async (req, res) => {
  try {
    const { theme, campaignGoal, targetAudience, toneOfVoice } = req.body as ContentRequest;

    const socialPrompt = `You are a social media content creator for Tea Dojo, a bubble tea brand in Singapore. Create engaging social media posts based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Description: ${theme.description}
Key Messages: ${theme.keyMessages.join(', ')}
Campaign Goal: ${campaignGoal}
Target Audience: ${targetAudience}
Tone of Voice: ${toneOfVoice}

Generate a JSON response with social media content for all platforms:
{
  "instagram": {
    "caption": "Instagram caption (150-200 words, include emojis, location mention, opening hours)",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"] (5 relevant hashtags)
  },
  "facebook": {
    "caption": "Facebook post (200-250 words, more detailed, include delivery options)",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"] (5 relevant hashtags)
  },
  "tiktok": {
    "caption": "TikTok caption (short, punchy, trendy, include POV or trending format)",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#FYP", "#TikTokSG"] (7 hashtags including FYP)
  }
}

Important:
- Make content specific to the theme (CNY should mention prosperity, Christmas should be festive, etc.)
- Include Singapore-specific references
- Use appropriate emojis for each platform
- Instagram should be visually descriptive
- Facebook should be informative and shareable
- TikTok should be trendy and use current formats

Respond ONLY with the JSON object, no additional text.`;

    const socialCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a social media expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: socialPrompt,
        },
      ],
      temperature: 0.8,
    });

    let socialResponseText = socialCompletion.choices[0]?.message?.content || '{}';
    socialResponseText = socialResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const socialContent: SocialContent = JSON.parse(socialResponseText);

    // Generate video script
    const videoPrompt = `Create a TikTok/Reels video script for Tea Dojo bubble tea based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Tone: ${toneOfVoice}

Generate a JSON response:
{
  "title": "Video title",
  "duration": "15-30 seconds",
  "scenes": [
    {"time": "0-3s", "visual": "Scene description", "audio": "Audio/music description", "text": "On-screen text"},
    {"time": "3-8s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "8-15s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "15-20s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "20-25s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"}
  ],
  "callToAction": "Call to action text"
}

Make it engaging, trendy, and specific to the campaign theme.
Respond ONLY with the JSON object.`;

    const videoCompletion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a video content creator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: videoPrompt,
        },
      ],
      temperature: 0.8,
    });

    let videoResponseText = videoCompletion.choices[0]?.message?.content || '{}';
    videoResponseText = videoResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const videoScript: VideoScript = JSON.parse(videoResponseText);

    res.json({ 
      success: true, 
      content: {
        social: socialContent,
        video: videoScript,
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Edit content using LLM
app.post('/api/edit-content', async (req, res) => {
  try {
    const { currentContent, editPrompt, platform } = req.body;

    const prompt = `You are editing social media content for Tea Dojo bubble tea. 

Current content:
${JSON.stringify(currentContent, null, 2)}

User's edit request: ${editPrompt}

Apply the user's requested changes and return the updated content in the same JSON format.
Respond ONLY with the updated JSON object, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a content editor. Apply the requested changes and respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    let editResponseText = completion.choices[0]?.message?.content || '{}';
    editResponseText = editResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const updatedContent = JSON.parse(editResponseText);

    res.json({ success: true, content: updatedContent });
  } catch (error) {
    console.error('Error editing content:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to edit content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Regenerate theme with refinement
app.post('/api/regenerate-theme', async (req, res) => {
  try {
    const { currentTheme, refinementPrompt, campaignGoal, targetAudience, toneOfVoice } = req.body;

    const prompt = `You are refining a marketing campaign theme for Tea Dojo bubble tea.

Current theme:
${JSON.stringify(currentTheme, null, 2)}

User's refinement request: ${refinementPrompt || 'Generate a new variation'}

Campaign Goal: ${campaignGoal}
Target Audience: ${targetAudience}
Tone of Voice: ${toneOfVoice}

Generate an improved/refined theme based on the feedback. Return a JSON object with the same structure:
{
  "name": "Campaign name",
  "slogan": "Catchy slogan with emojis",
  "description": "2-3 sentence description",
  "colors": ["#hex1", "#hex2", "#hex3"],
  "keyMessages": ["msg1", "msg2", "msg3", "msg4"]
}

Respond ONLY with the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative marketing expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
    });

    let regenResponseText = completion.choices[0]?.message?.content || '{}';
    regenResponseText = regenResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const theme = JSON.parse(regenResponseText);

    res.json({ success: true, theme });
  } catch (error) {
    console.error('Error regenerating theme:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to regenerate theme',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
