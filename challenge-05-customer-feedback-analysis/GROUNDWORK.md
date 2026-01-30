_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

The main goal of this challenge is to build a data pipeline that **aggregates customer feedback** from multiple sources and an AI model to **analyze it for sentiment and topics**.

### 1. Data Requirements

- **Customer Reviews**: Scraped data from various platforms:
    - **Google Maps/Google My Business**: Reviews for "Tea Dojo Ang Mo Kio".
    - **Facebook**: Comments on Tea Dojo's page and public posts mentioning the brand.
    - **Instagram**: Comments and mentions.
    - **Food Delivery Apps**: Reviews from platforms like GrabFood or Foodpanda if Tea Dojo is listed.
- **In-store Feedback**: A way to digitize and include feedback received verbally or through comment cards.

### 2. Key AI/ML Concepts

- **Web Scraping**: Programmatically extracting data from websites. This is a crucial first step.
- **Sentiment Analysis**: Classifying a piece of text as positive, negative, or neutral. This can be done with pre-trained models or by fine-tuning a model on a domain-specific dataset.
- **Aspect-Based Sentiment Analysis (ABSA)**: A more advanced technique that identifies the sentiment towards specific aspects of the business. For example, a review might be positive about the *drink* but negative about the *waiting time*.
- **Topic Modeling / Text Clustering**: Unsupervised learning techniques to automatically group reviews into common themes (e.g., "long queues", "new drink requests", "friendly staff").
- **Named Entity Recognition (NER)**: To identify specific menu items or ingredients mentioned in the reviews.

## Suggested Approaches

### Approach A: All-in-One Sentiment Analysis Dashboard

- **Description**: A web application that scrapes data from multiple sources, displays it in a unified dashboard, and provides sentiment and topic analysis.
- **Implementation**:
    - Write scrapers for Google, Facebook, etc., using libraries like **BeautifulSoup** or **Scrapy**.
    - For each review, use a pre-trained sentiment analysis model (e.g., from **Hugging Face Transformers**, **VADER**) to get a sentiment score.
    - Use a topic modeling library like **Gensim (LDA)** to identify key themes across all reviews.
    - Visualize the results on a dashboard using a library like **Plotly** or **Matplotlib**.
- **Pros**: Provides a comprehensive overview, highly practical for the business owner.
- **Cons**: Scraping can be complex and fragile if the websites change their structure.

### Approach B: Real-time Negative Feedback Alerter

- **Description**: A system that continuously monitors for new reviews and sends an immediate alert (e.g., via email or Telegram) if a negative review is detected.
- **Implementation**:
    - Set up scrapers to run periodically (e.g., every hour).
    - When a new review is found, pass it to a sentiment analysis model.
    - If the sentiment is negative (below a certain threshold), trigger an alert containing the review text and a link to the source.
    - Bonus: Use an LLM to draft a suggested reply for the business owner.
- **Pros**: Highly actionable, helps the business to be proactive in customer service.
- **Cons**: Requires a robust, continuously running system.

### Approach C: Aspect-Based Insight Extractor

- **Description**: A more sophisticated model that provides deep insights into what specific aspects of the business customers are happy or unhappy with.
- **Implementation**:
    - This is a more complex NLP task. You might need to train a custom model.
    - Use a library like **spaCy** for text processing and NER.
    - Implement or use a pre-trained ABSA model to find sentiment towards entities like "pearls", "staff", "price", "ambience".
    - Create a dashboard that shows the sentiment breakdown for each aspect of the business.
- **Pros**: Provides very granular and actionable insights.
- **Cons**: Technically challenging, may require labeled data for training.

## Resources

- **Web Scraping**:
    - [A Guide to Web Scraping with Python](https://www.scraperapi.com/blog/python-web-scraping-guide/)
- **Sentiment Analysis**:
    - [Hugging Face Transformers (for sentiment analysis)](https://huggingface.co/tasks/text-classification)
    - [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment)
- **Aspect-Based Sentiment Analysis**:
    - [PyABSA: Open-Source Framework for ABSA](https://github.com/yangheng95/pyabsa)
- **Dashboarding**:
    - [Dash by Plotly](https://plotly.com/dash/)

## Sample Data

See the `data` directory for sample JSON files of customer reviews scraped from different platforms.
