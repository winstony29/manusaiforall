_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

The core of this challenge is to build a **recommendation engine**. This can be approached in several ways, from simple rule-based systems to complex machine learning models.

### 1. Data Requirements

- **Menu Data**: A structured list of all drinks, toppings, and customization options (e.g., sugar levels, ice levels). This should include descriptions and potentially flavor tags (e.g., "creamy", "fruity", "refreshing").
- **Sales Data**: Anonymized transaction history. Each record should ideally include the items purchased, customizations, timestamp, and a unique customer ID.
- **Customer Data (Optional)**: Anonymized customer profiles with preferences (e.g., "likes sweet drinks", "prefers tea over coffee").
- **Contextual Data**: External data like weather forecasts for the Ang Mo Kio area.

### 2. Key AI/ML Concepts

- **Collaborative Filtering**: This technique recommends items based on the preferences of similar users. For example, if User A and User B have similar taste in drinks, and User B recently tried a new drink, the system could recommend it to User A.
- **Content-Based Filtering**: This technique recommends items based on their attributes. For example, if a user frequently orders "fruity" drinks, the system can recommend other drinks with the "fruity" tag.
- **Hybrid Models**: These models combine collaborative and content-based filtering to leverage the strengths of both approaches.
- **Natural Language Processing (NLP)**: If building a chatbot, NLP will be crucial for understanding user requests in natural language (e.g., "I want something refreshing but not too sweet").

## Suggested Approaches

### Approach A: Rule-Based Recommendation Engine

- **Description**: A simple but effective approach where recommendations are based on a set of predefined rules.
- **Implementation**:
    - Define rules based on common sense and domain knowledge (e.g., "If weather is hot, recommend refreshing fruit teas").
    - Create a simple UI (e.g., a web form) where users can input their preferences (e.g., "sweet" or "sour", "hot" or "cold").
- **Pros**: Easy to implement, transparent, and requires minimal data.
- **Cons**: Not personalized, requires manual rule creation, and may not discover novel recommendations.

### Approach B: Machine Learning-Based Recommendation Engine

- **Description**: A more advanced approach that uses machine learning to provide personalized recommendations.
- **Implementation**:
    - Use a library like Scikit-learn or TensorFlow to build a collaborative or content-based filtering model.
    - Train the model on the provided sales and menu data.
    - Deploy the model via a REST API that can be consumed by a web or mobile app.
- **Pros**: Highly personalized, can uncover non-obvious patterns, and improves over time with more data.
- **Cons**: Requires more data and technical expertise, can be a "black box".

### Approach C: Conversational AI (Chatbot)

- **Description**: A chatbot that acts as a virtual sommelier, guiding users to their perfect drink through a natural conversation.
- **Implementation**:
    - Use a framework like Rasa, Dialogflow, or Microsoft Bot Framework to build the chatbot.
    - Integrate a recommendation engine (either rule-based or ML-based) to power the chatbot's recommendations.
    - Deploy the chatbot on a platform like Facebook Messenger, WhatsApp, or a web widget.
- **Pros**: Highly engaging user experience, can handle complex queries.
- **Cons**: Requires expertise in conversational AI and NLP.

## Resources

- **Recommendation Engine Tutorials**:
    - [Building a Recommendation System with Python](https://www.datacamp.com/community/tutorials/recommender-systems-python)
    - [TensorFlow Recommenders](https://www.tensorflow.org/recommenders)
- **Chatbot Frameworks**:
    - [Rasa](https://rasa.com/)
    - [Google Dialogflow](https://cloud.google.com/dialogflow)
- **Weather Data API**:
    - [OpenWeatherMap API](https://openweathermap.org/api)

## Sample Data

See the `data` directory for sample CSV files for menu items and transactions.
