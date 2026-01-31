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

interface ColorPalette {
  name: string;
  colors: string[];
}

interface Theme {
  name: string;
  slogan: string;
  description: string;
  colors: string[];
  colorPalettes: ColorPalette[];
  selectedPaletteIndex: number;
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

interface MerchandiseDesign {
  type: string;
  category: 'packaging' | 'apparel';
  designPrompt: string;
  specifications: string;
}

interface ContentRequest {
  theme: Theme;
  themePrompt?: string;
  formats?: string[];
  merchandise?: string[];
  generateCaptions?: boolean;
  campaignGoal: string;
  targetAudience: string;
  toneOfVoice?: string;
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
  "colorPalettes": [
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 1: 6 harmonious colors),
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 2: 6 alternative colors),
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 3: 6 different variation)
  ],
  "keyMessages": ["message1", "message2", "message3", "message4"] (4 key marketing messages)
}

Important:
- Make the theme specific to the campaign goal (e.g., if it's CNY, use red/gold colors and prosperity themes)
- If it's Christmas, use festive colors and holiday themes
- If it's summer, use bright refreshing colors
- Each color palette should have 6 colors: primary, secondary, accent, background, text highlight, and complementary
- The 3 palette options should be distinct but all appropriate for the theme:
  * Option 1: Classic/Traditional interpretation
  * Option 2: Modern/Vibrant interpretation  
  * Option 3: Soft/Pastel interpretation
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
    const parsedTheme = JSON.parse(responseText);
    
    // Ensure we have the new structure with colorPalettes as objects
    const paletteNames = ['Classic', 'Modern', 'Soft'];
    let colorPalettes: ColorPalette[];
    
    if (Array.isArray(parsedTheme.colorPalettes)) {
      if (parsedTheme.colorPalettes[0] && typeof parsedTheme.colorPalettes[0] === 'object' && !Array.isArray(parsedTheme.colorPalettes[0])) {
        colorPalettes = parsedTheme.colorPalettes;
      } else {
        colorPalettes = parsedTheme.colorPalettes.map((colors: string[], index: number) => ({
          name: paletteNames[index] || `Option ${index + 1}`,
          colors: colors
        }));
      }
    } else {
      colorPalettes = [{ name: 'Classic', colors: parsedTheme.colors || [] }];
    }
    
    const theme: Theme = {
      name: parsedTheme.name,
      slogan: parsedTheme.slogan,
      description: parsedTheme.description,
      colorPalettes: colorPalettes,
      colors: colorPalettes[0]?.colors || [],
      selectedPaletteIndex: 0,
      keyMessages: parsedTheme.keyMessages
    };
    
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

// Generate social media content using LLM with theme-based prompts
app.post('/api/generate-content', async (req, res) => {
  try {
    const { theme, themePrompt, formats, merchandise, generateCaptions, campaignGoal, targetAudience, toneOfVoice } = req.body as ContentRequest;

    // Get selected color palette
    const selectedPalette = theme.colorPalettes[theme.selectedPaletteIndex] || theme.colorPalettes[0];
    const colorString = selectedPalette?.colors?.join(', ') || theme.colors?.join(', ') || '';
    
    // Build comprehensive theme prompt for all generations
    const fullThemePrompt = themePrompt || `Theme: "${theme.name}" - ${theme.slogan}. ${theme.description}. Key messages: ${theme.keyMessages.join(', ')}. Color palette (${selectedPalette?.name || 'Primary'}): ${colorString}. Target audience: ${targetAudience}. Tone: ${toneOfVoice || 'engaging'}.`;

    const socialPrompt = `You are a social media content creator for Tea Dojo, a bubble tea brand in Singapore. Create engaging social media posts based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Description: ${theme.description}
Key Messages: ${theme.keyMessages.join(', ')}
Color Palette: ${colorString}
Campaign Goal: ${campaignGoal}
Target Audience: ${targetAudience}
Tone of Voice: ${toneOfVoice || 'engaging'}

Full Theme Context: ${fullThemePrompt}

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

    // Generate video script with theme-based prompts
    const videoPrompt = `Create a TikTok/Reels video script for Tea Dojo bubble tea based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Description: ${theme.description}
Color Palette: ${colorString}
Tone: ${toneOfVoice || 'engaging'}

Full Theme Context: ${fullThemePrompt}

Generate a JSON response:
{
  "title": "Video title",
  "duration": "15-30 seconds",
  "scenes": [
    {"time": "0-3s", "visual": "Scene description incorporating campaign colors and theme", "audio": "Audio/music description", "text": "On-screen text"},
    {"time": "3-8s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "8-15s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "15-20s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"},
    {"time": "20-25s", "visual": "Scene description", "audio": "Audio description", "text": "On-screen text"}
  ],
  "callToAction": "Call to action text"
}

Make it engaging, trendy, and specific to the campaign theme. Incorporate the color palette visually.
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

    // Generate merchandise designs if requested
    let merchandiseDesigns: MerchandiseDesign[] = [];
    
    if (merchandise && merchandise.length > 0) {
      const merchPrompt = `You are a product designer for Tea Dojo bubble tea brand. Create detailed design prompts for merchandise items based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Description: ${theme.description}
Color Palette: ${colorString}
Tone of Voice: ${toneOfVoice || 'engaging'}

Full Theme Context: ${fullThemePrompt}

Generate design prompts for these items: ${merchandise.join(', ')}

Return a JSON array with each item:
[
  {
    "type": "Item name (e.g., Cup Design, Bag Design, T-Shirt Design)",
    "category": "packaging" or "apparel",
    "designPrompt": "Detailed design prompt including: visual elements, color usage (use the campaign colors: ${colorString}), typography style, placement of logo/slogan, theme-specific elements, and overall aesthetic direction. Be specific about how to incorporate the campaign theme and slogan.",
    "specifications": "Technical specifications for production"
  }
]

Make each design:
- Cohesive with the campaign theme and colors
- Include the slogan or key messages where appropriate
- Feature bubble tea related elements subtly
- Be print-ready and production-appropriate

Respond ONLY with the JSON array.`;

      try {
        const merchCompletion = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a product designer. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: merchPrompt,
            },
          ],
          temperature: 0.8,
        });

        let merchResponseText = merchCompletion.choices[0]?.message?.content || '[]';
        merchResponseText = merchResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        merchandiseDesigns = JSON.parse(merchResponseText);
      } catch (merchError) {
        console.error('Error generating merchandise designs:', merchError);
      }
    }

    // Generate image/video prompts for each selected format with theme integration
    const socialPosts = formats?.map(formatId => {
      const isVideo = formatId.includes('video') || formatId.includes('reel');
      const platform = formatId.split('-')[0];
      const aspectRatio = formatId.includes('square') ? '1:1' : 
                         formatId.includes('portrait') ? '4:5' : 
                         formatId.includes('story') || formatId.includes('reel') || formatId.includes('tiktok') ? '9:16' : '1.91:1';
      
      const platformContent = socialContent[platform as keyof SocialContent];
      
      return {
        platform,
        format: formatId,
        contentType: isVideo ? 'video' : 'image',
        aspectRatio,
        caption: platformContent?.caption || '',
        hashtags: platformContent?.hashtags?.join(' ') || '',
        imagePrompt: !isVideo ? `Create a ${aspectRatio} marketing image for Tea Dojo's "${theme.name}" campaign. Theme: ${theme.description}. Slogan: "${theme.slogan}". Use these colors prominently: ${colorString}. Style: ${toneOfVoice || 'engaging'}, modern, eye-catching. Feature bubble tea drinks with ${theme.keyMessages[0] || 'refreshing appeal'}. Target audience: ${targetAudience}.` : undefined,
        videoPrompt: isVideo ? `Create a ${aspectRatio} marketing video for Tea Dojo's "${theme.name}" campaign. Theme: ${theme.description}. Slogan: "${theme.slogan}". Color scheme: ${colorString}. Tone: ${toneOfVoice || 'engaging'}. Show bubble tea preparation, happy customers, and brand messaging. Include text overlays with key message: "${theme.keyMessages[0] || theme.slogan}".` : undefined
      };
    }) || [];

    res.json({ 
      success: true, 
      content: {
        social: socialContent,
        video: videoScript,
      },
      socialPosts,
      videoScript: {
        scenes: videoScript.scenes?.map((scene, index) => ({
          sceneNumber: index + 1,
          duration: scene.time,
          visualDescription: `${scene.visual}. Use campaign colors: ${colorString}. ${scene.text ? `Text overlay: "${scene.text}"` : ''}`
        }))
      },
      merchandiseDesigns,
      themePrompt: fullThemePrompt
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

// Generate single post content
app.post('/api/generate-post', async (req, res) => {
  try {
    const { format, description, targetAudience, generateCaption } = req.body;

    const prompt = `You are a social media content creator for Tea Dojo, a bubble tea brand in Singapore. Create content for a single post:

Platform: ${format.platform}
Format: ${format.label}
Content Type: ${format.contentType}
Aspect Ratio: ${format.aspectRatio}
Post Description: ${description}
Target Audience: ${targetAudience || 'General audience'}

Generate a JSON response:
{
  "caption": "Engaging caption with emojis (if generateCaption is true)",
  "hashtags": ["#relevant", "#hashtags"],
  "imagePrompt": "Detailed image generation prompt (if content type is image)",
  "videoScript": "Video script with scenes (if content type is video)"
}

Make it specific to the platform and engaging for the target audience.
Respond ONLY with the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a social media content creator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    let responseText = completion.choices[0]?.message?.content || '{}';
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const content = JSON.parse(responseText);

    res.json(content);
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ 
      error: 'Failed to generate post',
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
  "colorPalettes": [
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 1: 6 colors),
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 2: 6 colors),
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"] (Option 3: 6 colors)
  ],
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
    const parsedTheme = JSON.parse(regenResponseText);
    
    const paletteNames = ['Classic', 'Modern', 'Soft'];
    let colorPalettes: ColorPalette[];
    
    if (Array.isArray(parsedTheme.colorPalettes)) {
      if (parsedTheme.colorPalettes[0] && typeof parsedTheme.colorPalettes[0] === 'object' && !Array.isArray(parsedTheme.colorPalettes[0])) {
        colorPalettes = parsedTheme.colorPalettes;
      } else {
        colorPalettes = parsedTheme.colorPalettes.map((colors: string[], index: number) => ({
          name: paletteNames[index] || `Option ${index + 1}`,
          colors: colors
        }));
      }
    } else {
      colorPalettes = [{ name: 'Classic', colors: parsedTheme.colors || [] }];
    }
    
    const theme: Theme = {
      name: parsedTheme.name,
      slogan: parsedTheme.slogan,
      description: parsedTheme.description,
      colorPalettes: colorPalettes,
      colors: colorPalettes[0]?.colors || [],
      selectedPaletteIndex: 0,
      keyMessages: parsedTheme.keyMessages
    };

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

// Regenerate only color palettes
app.post('/api/regenerate-palette', async (req, res) => {
  try {
    const { themeName, themeDescription, campaignGoal } = req.body;

    const prompt = `Generate 3 different color palette options for a bubble tea marketing campaign.

Theme: ${themeName}
Description: ${themeDescription}
Campaign Goal: ${campaignGoal}

Generate a JSON response with 3 distinct color palette options, each with 6 colors:
{
  "colorPalettes": [
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"],
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"],
    ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"]
  ],
  "paletteNames": ["Classic", "Modern", "Soft"]
}

Each palette should have:
- Primary color (brand/main)
- Secondary color (supporting)
- Accent color (highlights)
- Background color (light/neutral)
- Text highlight color
- Complementary color

Make each option distinctly different:
- Option 1: Classic/Traditional interpretation
- Option 2: Modern/Vibrant interpretation
- Option 3: Soft/Pastel interpretation

Respond ONLY with the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a color palette expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
    });

    let paletteResponseText = completion.choices[0]?.message?.content || '{}';
    paletteResponseText = paletteResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(paletteResponseText);

    res.json({ 
      success: true, 
      colorPalettes: result.colorPalettes,
      paletteNames: result.paletteNames || ['Classic', 'Modern', 'Soft']
    });
  } catch (error) {
    console.error('Error regenerating palette:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to regenerate palette',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate merchandise designs standalone
app.post('/api/generate-merchandise', async (req, res) => {
  try {
    const { theme, merchandise, toneOfVoice } = req.body;

    const selectedPalette = theme.colorPalettes[theme.selectedPaletteIndex] || theme.colorPalettes[0];
    const colorString = selectedPalette?.colors?.join(', ') || theme.colors?.join(', ') || '';

    const merchPrompt = `You are a product designer for Tea Dojo bubble tea brand. Create detailed design prompts for merchandise items based on:

Campaign Theme: ${theme.name}
Slogan: ${theme.slogan}
Description: ${theme.description}
Color Palette: ${colorString}
Tone of Voice: ${toneOfVoice || 'engaging'}

Generate design prompts for these items: ${merchandise.join(', ')}

Return a JSON array with each item:
[
  {
    "type": "Item name",
    "category": "packaging" or "apparel",
    "designPrompt": "Detailed design prompt with visual elements, color usage, typography, logo placement, and theme elements",
    "specifications": "Technical specifications for production"
  }
]

Respond ONLY with the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a product designer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: merchPrompt,
        },
      ],
      temperature: 0.8,
    });

    let merchResponseText = completion.choices[0]?.message?.content || '[]';
    merchResponseText = merchResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const merchandiseDesigns = JSON.parse(merchResponseText);

    res.json({ success: true, merchandiseDesigns });
  } catch (error) {
    console.error('Error generating merchandise:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate merchandise designs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
