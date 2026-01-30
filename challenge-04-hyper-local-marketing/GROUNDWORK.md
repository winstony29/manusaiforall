_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

The goal of this challenge is to build an AI system that can **generate hyper-local marketing content** and **optimize its delivery**. This involves social media analysis, content generation, and campaign performance tracking.

### 1. Data Requirements

- **Local Social Media Data**: Scraped data from public social media groups, pages, or hashtags related to Ang Mo Kio. This could include posts from community forums, local influencers, or nearby businesses.
- **Customer Data**: Anonymized customer data, including purchase history and location (if available, e.g., from a delivery app).
- **Local Event Calendars**: Information on upcoming events in the Ang Mo Kio area (e.g., from local community centers, schools, or event websites).
- **Tea Dojo's Social Media Data**: Historical data from Tea Dojo's own social media accounts to analyze past performance.

### 2. Key AI/ML Concepts

- **Topic Modeling**: Techniques like **Latent Dirichlet Allocation (LDA)** can be used to discover topics of conversation within the local social media data (e.g., "complaints about the weather", "excitement for a local festival").
- **Sentiment Analysis**: To gauge the public's mood and opinions on different topics.
- **Generative AI / Large Language Models (LLMs)**: For generating creative marketing copy, social media captions, and promotional ideas that are relevant to the identified local topics and sentiments.
- **Performance Analytics**: Tracking metrics like engagement rate, reach, and click-through rate to measure the effectiveness of campaigns.

## Suggested Approaches

### Approach A: Social Listening and Content Idea Generation

- **Description**: A dashboard that monitors local social media for trends and suggests marketing angles.
- **Implementation**:
    - Use social media APIs (e.g., Twitter, Facebook) or web scraping tools (e.g., BeautifulSoup, Scrapy) to collect data.
    - Apply topic modeling and sentiment analysis to the collected data.
    - Present the trending topics and associated sentiment on a dashboard.
    - Use an LLM to generate 3-5 marketing post ideas based on the top trends.
- **Pros**: Provides actionable insights, automates the creative process.
- **Cons**: Requires robust data collection and processing pipeline.

### Approach B: Automated Content Creation and Scheduling

- **Description**: An end-to-end system that not only generates ideas but also creates and schedules the content.
- **Implementation**:
    - Build on Approach A by adding a content generation module.
    - Use an LLM with prompt engineering to create complete social media posts (text and even image ideas).
    - Integrate with social media APIs to allow for automated scheduling of posts.
    - Include a feedback loop where the system analyzes the performance of past posts to improve future content.
- **Pros**: Highly automated, can run with minimal human intervention.
- **Cons**: More complex to build, requires careful management of automated posting to avoid a "spammy" appearance.

### Approach C: Community Partnership Identifier

- **Description**: An AI tool that identifies potential local partners for cross-promotions.
- **Implementation**:
    - Analyze social media data to find local businesses, influencers, or community groups that are popular in Ang Mo Kio.
    - Rank potential partners based on their relevance, reach, and engagement.
    - Use an LLM to draft an outreach message to potential partners.
- **Pros**: Opens up new marketing channels, builds community relationships.
- **Cons**: The "last mile" of forming the partnership still requires human intervention.

## Resources

- **Social Media APIs**:
    - [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
    - [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- **Web Scraping**:
    - [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
    - [Scrapy](https://scrapy.org/)
- **Topic Modeling**:
    - [Gensim (for LDA)](https://radimrehurek.com/gensim/models/ldamodel.html)
- **LLM APIs**:
    - [OpenAI API](https://platform.openai.com/)
    - [Google AI Platform](https://ai.google/)

## Sample Data

See the `data` directory for sample JSON files of scraped social media posts.
