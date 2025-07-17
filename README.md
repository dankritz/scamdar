# 🛡️ Scamdar Chrome Extension

A Chrome extension that analyzes web pages for scam indicators using OpenRouter's AI models and provides a safety score from 0-100.

## Features

- **Real-time Analysis**: Scans the current web page content for scam indicators
- **Safety Score**: Provides a score from 0 (safe) to 100 (definitely a scam)
- **Analysis Details**: Shows detailed motivation for why the score was assigned
- **Visual Feedback**: Color-coded results with clear safety messages
- **Modern UI**: Clean, intuitive interface with gradient design
- **Lightweight**: Minimal impact on browser performance

## How It Works

1. **Content Extraction**: The extension extracts page content including text, links, forms, and metadata
2. **AI Analysis**: Sends the content to OpenRouter's Gemini 2.5 Flash model for intelligent scam detection
3. **Score Display**: Shows the safety score with visual indicators and detailed explanations

## Installation

### Development Installation

1. **Clone or Download** this repository to your local machine

2. **Add Icon Files** (Required):
   - Navigate to the `icons/` directory
   - Follow the instructions in `icons/README.md` to create the required PNG files:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels) 
     - `icon128.png` (128x128 pixels)

3. **Load Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The Scamdar extension should now appear in your extensions list

4. **Pin Extension** (Optional):
   - Click the extensions icon (puzzle piece) in Chrome toolbar
   - Find Scamdar and click the pin icon to keep it visible

5. **Configure OpenRouter API Key**:
   - Get an API key from [OpenRouter](https://openrouter.ai/keys)
   - Click the Scamdar extension icon in your toolbar
   - Click the settings button (⚙️) in the top right
   - Enter your OpenRouter API key and click "Save"
   - You should see "✅ API Key Configured" status

## Usage

1. **Navigate** to any website you want to analyze
2. **Click** the Scamdar extension icon in your browser toolbar
3. **Click** the "Scan Current Page" button
4. **View Results**: The extension will display:
   - A safety score (0-100)
   - Color-coded risk level (Green/Orange/Red)
   - Safety message and recommendations
   - Detailed analysis motivation explaining the scoring
   - Link to this GitHub repository for updates and support

## Safety Score Interpretation

- **0-30 (Green)**: Low risk - Website appears safe
- **31-70 (Orange)**: Moderate risk - Exercise caution
- **71-100 (Red)**: High risk - Likely scam, avoid interaction

## File Structure

```
scamdar/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── background.js         # Service worker for API calls
├── content.js            # Content extraction script
├── styles.css            # UI styling
├── icons/                # Extension icons
│   ├── README.md        # Icon creation instructions
│   ├── icon16.png       # 16x16 toolbar icon
│   ├── icon48.png       # 48x48 management icon
│   └── icon128.png      # 128x128 store icon
└── README.md            # This file
```

## Technical Details

### API Integration

The extension uses OpenRouter to access advanced AI models:
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `google/gemini-2.5-flash`
- **Authentication**: Bearer token with your OpenRouter API key
- **Headers**: Includes `X-Title: Scamdar-Chrome-Extension` for proper attribution
- **Analysis**: AI model returns JSON with `score` (0-100) and `motivation` explaining the assessment

### Content Extraction

The extension analyzes:
- Complete HTML source code of the page
- Page text content (up to 10,000 characters)
- All links and their destinations
- Form inputs and structure
- Page metadata and meta tags
- Domain and protocol information
- Page title and URL

### Privacy & Security

- **API Key Storage**: Your OpenRouter API key is stored locally in Chrome's sync storage
- **No Personal Data**: Only analyzes public page content
- **No Tracking**: Does not store or track user browsing
- **Secure Communication**: Uses HTTPS for all API calls to OpenRouter
- **Local Processing**: Content extraction happens locally, only summarized data sent to AI

## Development

### Prerequisites

- Chrome browser
- OpenRouter account and API key ([Sign up here](https://openrouter.ai/))
- Basic knowledge of Chrome extension development

### Setup Requirements

1. **OpenRouter Account**: Create a free account at [OpenRouter](https://openrouter.ai/)
2. **API Key**: Generate an API key in the [OpenRouter Keys](https://openrouter.ai/keys) section
3. **Credits**: Add credits to your OpenRouter account for API usage (Gemini 2.5 Flash is very affordable)

### Testing

1. Load the extension in developer mode
2. Test on various websites (safe and suspicious)
3. Check console logs for any errors
4. Verify API responses are properly handled

### Customization

- **Styling**: Modify `styles.css` for UI changes
- **AI Model**: Change `MODEL` constant in `background.js` to use different OpenRouter models
- **Analysis Prompt**: Modify the analysis prompt in `analyzeWithOpenRouter()` function
- **Content Extraction**: Enhance `extractPageContent()` in `content.js`
- **UI Messages**: Update safety messages in `popup.js`

## Troubleshooting

### Extension Not Loading
- Ensure all files are present in the directory
- Check that icon files exist in the `icons/` folder
- Verify manifest.json is valid JSON

### Analysis Not Working
- **API Key Issues**: Ensure your OpenRouter API key is correctly entered in settings
- **Credits**: Check that your OpenRouter account has sufficient credits
- **Network**: Verify internet connectivity and that OpenRouter.ai is accessible
- **Console Errors**: Check browser console (F12) for detailed error messages
- **Permissions**: Ensure content script permissions are granted

### OpenRouter API Issues
- **401 Unauthorized**: Invalid or missing API key - check your key in settings
- **429 Rate Limited**: Too many requests - wait a moment before trying again
- **402 Payment Required**: Insufficient credits - add credits to your OpenRouter account
- **Model Unavailable**: The Gemini model may be temporarily unavailable

### Visual Issues
- Clear browser cache and reload extension
- Check if CSS files are loading properly
- Verify popup dimensions work on your screen

## Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Edge**: Should work with Chromium-based Edge
- **Firefox**: Not compatible (uses different extension API)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console (F12) for error messages
3. Verify your OpenRouter account status and credits
4. Test on multiple websites to isolate issues

## License

This project is provided as-is for educational and security purposes. It is governed by the MIT License. See the LICENSE file for more information.