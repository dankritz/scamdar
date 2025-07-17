document.addEventListener('DOMContentLoaded', function() {
    // Main UI elements
    const scanButton = document.getElementById('scanButton');
    const scanText = document.querySelector('.scan-text');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const results = document.getElementById('results');
    const error = document.getElementById('error');
    const scoreValue = document.getElementById('scoreValue');
    const scoreMessage = document.getElementById('scoreMessage');
    const motivation = document.getElementById('motivation');
    const motivationText = document.getElementById('motivationText');
    
    // Settings UI elements
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    const settingsBtn = document.getElementById('settingsBtn');
    const backBtn = document.getElementById('backBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveApiKey = document.getElementById('saveApiKey');
    const clearApiKey = document.getElementById('clearApiKey');
    const apiStatus = document.getElementById('apiStatus');

    // Initialize UI on load
    initializeUI();
    
    // Settings navigation
    settingsBtn.addEventListener('click', function() {
        showSettingsView();
    });
    
    backBtn.addEventListener('click', function() {
        showMainView();
    });
    
    // API key management
    saveApiKey.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            await chrome.storage.sync.set({ openRouterApiKey: apiKey });
            await updateApiStatus();
            showMainView();
        }
    });
    
    clearApiKey.addEventListener('click', async function() {
        await chrome.storage.sync.remove('openRouterApiKey');
        apiKeyInput.value = '';
        await updateApiStatus();
    });

    scanButton.addEventListener('click', async function() {
        try {
            // Check API key first
            const { openRouterApiKey } = await chrome.storage.sync.get('openRouterApiKey');
            if (!openRouterApiKey) {
                showError('Please configure your OpenRouter API key in settings.');
                return;
            }
            
            // Reset UI
            results.style.display = 'none';
            error.style.display = 'none';
            
            // Show loading state
            scanText.textContent = 'Scanning...';
            loadingSpinner.style.display = 'inline-block';
            scanButton.disabled = true;

            // Get current tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                throw new Error('Cannot scan this type of page');
            }

            // Send message to background script to analyze the page
            const response = await chrome.runtime.sendMessage({
                action: 'analyzePage',
                tabId: tab.id,
                url: tab.url
            });

            if (response.success) {
                displayResults(response.score, response.motivation);
            } else {
                throw new Error(response.error || 'Analysis failed');
            }

        } catch (err) {
            console.error('Error during scan:', err);
            showError(err.message);
        } finally {
            // Reset button state
            scanText.textContent = 'Scan Current Page';
            loadingSpinner.style.display = 'none';
            scanButton.disabled = false;
        }
    });

    function displayResults(score, motivationData) {
        scoreValue.textContent = score;
        
        // Update score circle color and message based on score
        const scoreCircle = document.querySelector('.score-circle');
        const message = getScoreMessage(score);
        
        scoreCircle.className = 'score-circle ' + getScoreClass(score);
        scoreMessage.textContent = message;
        
        // Display motivation if available
        if (motivationData && motivationData.trim()) {
            motivationText.textContent = motivationData;
            motivation.style.display = 'block';
        } else {
            motivation.style.display = 'none';
        }
        
        results.style.display = 'block';
    }

    function getScoreClass(score) {
        if (score <= 30) return 'safe';
        if (score <= 70) return 'moderate';
        return 'high';
    }

    function getScoreMessage(score) {
        if (score <= 30) {
            return '✅ This website appears to be safe with low scam indicators.';
        } else if (score <= 70) {
            return '⚠️ Some potential red flags detected. Exercise caution.';
        } else {
            return '🚨 High risk detected! This website may be a scam.';
        }
    }

    function showError(message) {
        if (message) {
            error.querySelector('p').textContent = `⚠️ ${message}`;
        }
        error.style.display = 'block';
    }
    
    // UI Management Functions
    async function initializeUI() {
        await updateApiStatus();
        // Load saved API key for editing
        const { openRouterApiKey } = await chrome.storage.sync.get('openRouterApiKey');
        if (openRouterApiKey) {
            apiKeyInput.value = openRouterApiKey;
        }
    }
    
    async function updateApiStatus() {
        const { openRouterApiKey } = await chrome.storage.sync.get('openRouterApiKey');
        if (openRouterApiKey) {
            apiStatus.textContent = '✅ Ready to scan';
            apiStatus.className = 'api-status configured';
            scanButton.disabled = false;
        } else {
            apiStatus.textContent = '⚠️ OpenRouter API Key Required';
            apiStatus.className = 'api-status required';
            scanButton.disabled = true;
        }
    }
    
    function showSettingsView() {
        mainView.style.display = 'none';
        settingsView.style.display = 'block';
        results.style.display = 'none';
        error.style.display = 'none';
    }
    
    function showMainView() {
        settingsView.style.display = 'none';
        mainView.style.display = 'block';
    }
}); 