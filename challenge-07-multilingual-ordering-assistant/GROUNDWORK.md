_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

This challenge combines **conversational AI** with **multilingual speech and text processing**. The goal is to build an ordering system that is accessible to a diverse, multilingual community.

### 1. Data Requirements

- **Multilingual Menu Data**: The menu (drinks, toppings, customizations) needs to be translated into the target languages (e.g., English, Mandarin, Malay). This includes not just the names but also descriptions.
- **Training Phrases**: For a voice-based system, you'll need sample phrases for ordering in each language. These can be generated or collected. Examples in Mandarin:
    - "我要一杯珍珠奶茶" (I want a cup of pearl milk tea)
    - "少糖, 去冰" (Less sugar, no ice)
- **Entity Synonyms**: A list of different ways to refer to the same item in each language. For example, "bubble tea", "pearl tea", and "boba" in English, or "珍珠奶茶" and "波霸奶茶" in Mandarin.

### 2. Key AI/ML Concepts

- **Speech-to-Text (STT)**: Transcribing spoken language into text. This is the first step for a voice-based system. The STT engine must support multiple languages.
- **Natural Language Understanding (NLU)**: As in the event booking challenge, this is for extracting intents and entities from the user's request (text or transcribed speech).
- **Machine Translation**: To translate menu items or user queries if a language is not directly supported by the NLU.
- **Text-to-Speech (TTS)**: To generate spoken responses from the AI assistant in the user's chosen language.

## Suggested Approaches

### Approach A: Text-Based Multilingual Chatbot

- **Description**: A chatbot (on a kiosk or mobile app) that allows users to select their language and then type their order.
- **Implementation**:
    - Use a conversational AI platform that supports multiple languages (e.g., **Rasa**, **Dialogflow**).
    - Create separate NLU models for each language, or use a single multilingual model.
    - The core logic (dialogue management) can be shared across languages.
    - The UI would present a language selection screen at the start.
- **Pros**: Simpler than a voice-based system as it avoids the complexities of speech processing.
- **Cons**: Not as accessible for users who have difficulty typing or are not literate.

### Approach B: Voice-Activated Multilingual Kiosk

- **Description**: A physical kiosk with a microphone and screen where customers can place their order by speaking in their preferred language.
- **Implementation**:
    - Use a multilingual STT service (e.g., **Google Speech-to-Text**, **Azure Speech Services**).
    - The transcribed text is then fed into an NLU engine (as in Approach A).
    - Use a TTS service to generate the audio response.
    - The kiosk UI should provide visual feedback, showing the order as it's being built.
- **Pros**: Highly accessible, provides a futuristic and inclusive user experience.
- **Cons**: More complex, requires hardware (microphone, speaker), and needs to be robust to noisy environments.

### Approach C: Universal Translation Layer

- **Description**: A system that translates all non-English input into English before processing it with a single English-language NLU model.
- **Implementation**:
    - Use a translation API (e.g., **Google Translate API**, **DeepL API**) as the first step.
    - The translated English text is then processed by an English-only chatbot.
    - The chatbot's English response is then translated back into the user's original language.
- **Pros**: Reduces the need to build and maintain NLU models for multiple languages.
- **Cons**: Can be prone to translation errors, which can lead to incorrect orders. May lose nuances of the original language.

## Resources

- **Multilingual Conversational AI**:
    - [Rasa: Building Multilingual Chatbots](https://rasa.com/docs/rasa/building-assistants/language-support/)
    - [Dialogflow: Languages](https://cloud.google.com/dialogflow/es/docs/reference/language)
- **Speech-to-Text Services**:
    - [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
    - [Azure Speech Services](https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/)
- **Translation Services**:
    - [Google Translate API](https://cloud.google.com/translate)

## Sample Data

See the `data` directory for a sample JSON file containing the menu translated into English, into English, into English, Mandarin, and Malay.
