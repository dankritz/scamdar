// Background service worker for Scamdar extension

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzePage') {
        handlePageAnalysis(request.tabId, request.url)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error('Error analyzing page:', error);
                sendResponse({ 
                    success: false, 
                    error: error.message || 'Analysis failed' 
                });
            });
        
        // Return true to indicate we'll send response asynchronously
        return true;
    }
});

async function handlePageAnalysis(tabId, url) {
    try {
        // Inject content script if needed
        await ensureContentScriptInjected(tabId);
        
        // Get page content from content script
        const contentResponse = await sendMessageToTab(tabId, { action: 'getPageContent' });
        
        if (!contentResponse.success) {
            throw new Error(contentResponse.error || 'Failed to extract page content');
        }

        // Send content to OpenRouter for analysis
        const analysisResult = await analyzeWithOpenRouter(contentResponse.content);
        
        return { 
            success: true, 
            score: analysisResult.score,
            motivation: analysisResult.motivation
        };
        
    } catch (error) {
        console.error('Page analysis error:', error);
        throw error;
    }
}

async function ensureContentScriptInjected(tabId) {
    try {
        // Try to ping the content script
        await sendMessageToTab(tabId, { action: 'ping' });
    } catch (error) {
        // Content script not available, inject it
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
}

async function sendMessageToTab(tabId, message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

async function analyzeWithOpenRouter(pageContent) {
    try {
        // Get API key from storage
        const { openRouterApiKey } = await chrome.storage.sync.get('openRouterApiKey');
        if (!openRouterApiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        // Prepare the content for analysis
        const contentSummary = {
            url: pageContent.url,
            domain: pageContent.domain,
            title: pageContent.title,
            text_content: pageContent.text.substring(0, 5000), // Limit text to avoid token limits
            link_count: pageContent.links.length,
            external_links: pageContent.links.filter(link => link.isExternal).length,
            form_count: pageContent.forms.length,
            has_payment_forms: pageContent.forms.some(form => 
                form.inputs.some(input => 
                    input.type === 'password' || 
                    input.name.toLowerCase().includes('card') ||
                    input.name.toLowerCase().includes('payment')
                )
            )
        };

        const prompt = `You are a website security analyzer. Analyze the following website content for scam indicators and respond with ONLY a valid JSON object.

Website Data:
- URL: ${contentSummary.url}
- Domain: ${contentSummary.domain}
- Title: ${contentSummary.title}
- Text Content: ${contentSummary.text_content}
- Total Links: ${contentSummary.link_count}
- External Links: ${contentSummary.external_links}
- Forms: ${contentSummary.form_count}
- Has Payment Forms: ${contentSummary.has_payment_forms}

Analyze for scam indicators: suspicious URLs, phishing patterns, urgency tactics, payment requests, poor grammar, misleading claims, fake urgency, suspicious redirects.

IMPORTANT: Respond with ONLY the JSON object below, no additional text or explanation:

{
  "score": <number 0-100, where 0=completely safe, 100=definitely a scam>,
  "motivation": "<detailed explanation of why this score was assigned>"
}`;

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterApiKey}`,
                'Content-Type': 'application/json',
                'X-Title': 'Scamdar-Chrome-Extension'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a website security analyzer that responds only with valid JSON objects. Never include any text outside the JSON response.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            throw new Error('Invalid response format from OpenRouter');
        }

        const content = result.choices[0].message.content;
        console.log('AI Response received:', content);
        
        // Extract JSON from the response (AI might include extra text)
        let analysisResult;
        try {
            // First try direct parsing
            analysisResult = JSON.parse(content);
        } catch (parseError) {
            // Try to extract from markdown code blocks
            const markdownMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (markdownMatch) {
                try {
                    analysisResult = JSON.parse(markdownMatch[1]);
                } catch (mdError) {
                    // Fall through to brace extraction
                }
            }
            
            // If that fails, try to extract JSON from the response
            if (!analysisResult) {
                try {
                    // Try to extract JSON by finding balanced braces
                    const startIndex = content.indexOf('{');
                    if (startIndex === -1) {
                        throw new Error('No JSON object found in response');
                    }
                    
                    let braceCount = 0;
                    let endIndex = -1;
                    
                    for (let i = startIndex; i < content.length; i++) {
                        if (content[i] === '{') {
                            braceCount++;
                        } else if (content[i] === '}') {
                            braceCount--;
                            if (braceCount === 0) {
                                endIndex = i;
                                break;
                            }
                        }
                    }
                    
                    if (endIndex === -1) {
                        throw new Error('Incomplete JSON object in response');
                    }
                    
                    const jsonStr = content.substring(startIndex, endIndex + 1);
                    analysisResult = JSON.parse(jsonStr);
                } catch (extractError) {
                    console.error('AI Response:', content);
                    console.error('Extract Error:', extractError);
                    throw new Error(`Failed to parse analysis result. AI returned: ${content.substring(0, 200)}...`);
                }
            }
        }
        
        if (!analysisResult || typeof analysisResult !== 'object') {
            throw new Error('Invalid analysis result: not a valid object');
        }
        
        if (typeof analysisResult.score !== 'number') {
            console.error('Analysis result:', analysisResult);
            throw new Error('Invalid analysis result: missing or invalid score field');
        }

        // Ensure score is between 0 and 100
        const score = Math.max(0, Math.min(100, Math.round(analysisResult.score)));
        const motivation = analysisResult.motivation || 'No detailed analysis available';
        
        return {
            score: score,
            motivation: motivation
        };
        
    } catch (error) {
        console.error('OpenRouter analysis error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
    }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Scamdar extension installed successfully');
    }
}); 