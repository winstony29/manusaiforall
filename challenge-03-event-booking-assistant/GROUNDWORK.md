_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

The core of this challenge is to build a **conversational AI agent** that can automate the event booking process. This involves Natural Language Understanding (NLU) to interpret customer requests and a dialogue management system to guide the conversation.

### 1. Data Requirements

- **Service & Pricing Data**: A structured document detailing the different event packages (live station, push cart), pricing tiers (e.g., per hour, per person), included services, and add-on options.
- **Availability Data**: Access to a calendar system (even a simple mock one) to check for available dates and times.
- **Customer Inquiry Data**: A sample set of real (anonymized) or synthetic customer inquiries. This is crucial for training the NLU model. Examples:
    - "Hi, I want to ask about live station for my wedding."
    - "How much is the push cart for a 2-hour birthday party for 50 people?"
    - "Are you free on Dec 10th for a corporate event?"
- **Location Data**: Potentially a list of serviceable areas or a way to calculate travel costs based on location.

### 2. Key AI/ML Concepts

- **Natural Language Understanding (NLU)**: The AI needs to extract key information (entities) from user messages, such as `event_type` (wedding, party), `service_type` (live station, push cart), `num_guests`, `date`, and `duration`.
- **Dialogue Management**: This component decides the chatbot's next action based on the current state of the conversation. It manages the flow, asks clarifying questions, and ensures all necessary information is collected before confirming a booking.
- **Entity Extraction**: Identifying and extracting structured data from unstructured text.
- **Intent Classification**: Determining the user's goal (e.g., `request_quote`, `check_availability`, `make_booking`).

## Suggested Approaches

### Approach A: End-to-End Conversational AI Platform

- **Description**: Use a comprehensive platform that provides tools for NLU, dialogue management, and integration.
- **Implementation**:
    - Use a platform like **Rasa**, **Google Dialogflow**, or **Microsoft Bot Framework**.
    - Define intents (e.g., `greet`, `request_quote`, `provide_details`) and entities (e.g., `date`, `num_guests`).
    - Create "stories" or "flows" that define the conversational paths.
    - Connect the chatbot to a backend that can calculate quotes and check calendar availability.
- **Pros**: Robust, scalable, and provides a full suite of tools for building sophisticated chatbots.
- **Cons**: Can have a steeper learning curve.

### Approach B: Large Language Model (LLM) with Function Calling

- **Description**: Leverage a powerful LLM (like GPT-4 or Gemini) to handle the natural language understanding and conversation, and use "function calling" to trigger actions in your backend.
- **Implementation**:
    - Use an API from a provider like OpenAI or Google AI.
    - Define a set of functions your backend can perform, such as `calculate_quote(pax, hours, service_type)` or `check_availability(date)`.
    - The LLM will parse the user's request and determine which function to call with which arguments.
- **Pros**: Excellent NLU capabilities out-of-the-box, can handle a wide range of conversational styles, and requires less training data.
- **Cons**: Relies on an external API (cost and latency), and may be less customizable than a self-hosted solution.

### Approach C: Simple Keyword-Based Chatbot

- **Description**: A more basic approach that uses keyword matching and simple rules to guide the conversation.
- **Implementation**:
    - Write a script (e.g., in Python) that looks for keywords in the user's input.
    - Use a series of `if/else` statements to create a decision tree for the conversation.
    - Example: If the message contains "how much" and "live station", prompt the user for the number of guests and hours.
- **Pros**: Very simple to implement, no AI/ML knowledge required.
- **Cons**: Brittle, can't handle variations in language, and provides a poor user experience for anything but the most basic queries.

## Resources

- **Conversational AI Platforms**:
    - [Rasa](https://rasa.com/)
    - [Google Dialogflow](https://cloud.google.com/dialogflow)
- **LLM APIs**:
    - [OpenAI API (Function Calling)](https://platform.openai.com/docs/guides/function-calling)
    - [Google AI Platform](https://ai.google/)
- **Calendar Integration**:
    - [Google Calendar API](https://developers.google.com/calendar)

## Sample Data

See the `data` directory for sample JSON files for service packages and customer inquiries.
