# Privacy Policy for Scamdar Chrome Extension

**Last Updated:** July 17, 2025

This Privacy Policy describes how the "Scamdar" Chrome Extension ("the Extension") collects, uses, and shares information. The Extension is designed to help users analyze web pages for potential scam indicators by leveraging AI models.

## 1. Introduction

Scamdar is committed to protecting your privacy. This policy outlines our practices regarding the data collected and processed through the Extension to provide its core functionality. We do not aim to collect any personally identifiable information (PII) about you.

## 2. What Information We Collect and Process

The Extension primarily collects and processes **website content** from the active tab **only when you explicitly click the "Scan Current Page" button**. The information collected is used solely for the purpose of analyzing the current page for scam indicators.

Specifically, the Extension collects and processes the following data from the active webpage:

* **Website Content**:
    * The full URL of the page.
    * The page title.
    * The full HTML content of the page.
    * Main text content extracted from visible elements on the page (limited to 10,000 characters).
    * Details of all links present on the page (href and text), indicating if they are external.
    * Information about forms on the page, including their actions, methods, and types/names/placeholders of input fields.
    * Metadata from the page's `<meta>` tags.
    * The domain and protocol of the current page.

* **OpenRouter API Key**: The Extension requires an OpenRouter API key to function. This key is provided by you and is stored locally in your Chrome browser's sync storage. This key is used solely for authenticating requests to the OpenRouter API.

### What We Do NOT Collect or Process:

* **Personally Identifiable Information (PII)**: The Extension does not collect your name, address, email address, age, identification numbers, or any other information that could directly identify you. Only public page content is analyzed.
* **Health Information**: We do not collect or process any health-related data.
* **Financial and Payment Information**: While the Extension analyzes the *structure* of forms to identify if they contain fields commonly used for payment (e.g., password type inputs, or fields named "card" or "payment"), it **does not collect, transmit, or store any actual financial data** such as credit card numbers, bank account details, or payment history.
* **Personal Communications**: We do not access or process your emails, texts, chat messages, or any other form of personal communication.
* **Precise Location Data**: The Extension uses the URL and domain of the current page for analysis, which may indirectly indicate a general region. However, it does not collect precise location data such as GPS coordinates or IP addresses directly from your device.
* **Web History**: The Extension analyzes only the currently active tab when you initiate a scan; it does not access, store, or track your Browse history.
* **Continuous User Activity**: The Extension does not monitor your network activity, clicks, mouse position, scroll behavior, or keystroke logging. Its operation is triggered explicitly by your action.

## 3. How We Use the Collected Information

The website content collected from the active tab is summarized and sent to the **OpenRouter API** (`https://openrouter.ai/api/v1/chat/completions`). This is done to leverage OpenRouter's AI models (specifically `google/gemini-2.5-flash`) for intelligent scam detection and to receive a safety score and detailed analysis motivation.

The OpenRouter API key is used to authenticate these requests.

## 4. Data Storage

* **OpenRouter API Key**: Your OpenRouter API key is stored securely in your Chrome browser's `chrome.storage.sync`. This allows the key to be accessible to the Extension and synced across your Chrome installations.
* **Website Content**: The extracted website content is processed in real-time and is not persistently stored by the Extension after the analysis is complete and the results are displayed. It is sent to OpenRouter for processing as part of the analysis request.

## 5. Data Sharing

The collected website content (summarized as URL, domain, title, text content (up to 5000 characters), link count, external link count, form count, and presence of payment forms) is shared with OpenRouter (`https://openrouter.ai`) for the purpose of AI analysis. This is a necessary step for the Extension to provide its core scam detection functionality.

Please refer to [OpenRouter's Privacy Policy](https://openrouter.ai/legal/privacy) for details on how OpenRouter handles data they receive.

## 6. Data Security

The Extension uses secure communication protocols (HTTPS) for all API calls to OpenRouter to protect the data in transit. Your OpenRouter API key is handled securely within the browser's storage mechanisms.

## 7. User Consent

By installing and using the Scamdar Chrome Extension, you consent to the collection and processing of website content as described in this Privacy Policy when you explicitly initiate a scan. You also consent to the storage and use of your OpenRouter API key for the Extension's functionality.

## 8. Changes to this Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.

## 9. Contact Information

If you have any questions or concerns about this Privacy Policy or the data practices of the Scamdar Chrome Extension, please refer to the [Scamdar GitHub Repository](https://github.com/dankritz/scamdar) for support and contact information.