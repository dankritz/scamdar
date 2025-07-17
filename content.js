// Content script to extract page content for scam analysis

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        try {
            const pageContent = extractPageContent();
            sendResponse({ success: true, content: pageContent });
        } catch (error) {
            console.error('Error extracting page content:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
});

function extractPageContent() {
    const content = {
        url: window.location.href,
        title: document.title,
        html: document.documentElement.outerHTML,
        text: '',
        links: [],
        forms: [],
        metadata: {}
    };

    // Extract main text content
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td');
    const textContent = [];
    
    textElements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 10 && !isHiddenElement(el)) {
            textContent.push(text);
        }
    });
    
    content.text = textContent.join(' ').substring(0, 10000); // Limit to 10k chars

    // Extract links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim();
        if (href && text) {
            content.links.push({
                href: href,
                text: text,
                isExternal: isExternalLink(href)
            });
        }
    });

    // Extract forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        const formData = {
            action: form.getAttribute('action') || '',
            method: form.getAttribute('method') || 'get',
            inputs: []
        };
        
        inputs.forEach(input => {
            formData.inputs.push({
                type: input.type || input.tagName.toLowerCase(),
                name: input.name || '',
                placeholder: input.placeholder || ''
            });
        });
        
        content.forms.push(formData);
    });

    // Extract metadata
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content_attr = meta.getAttribute('content');
        if (name && content_attr) {
            content.metadata[name] = content_attr;
        }
    });

    // Add domain information
    content.domain = window.location.hostname;
    content.protocol = window.location.protocol;

    return content;
}

function isHiddenElement(element) {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || 
           style.visibility === 'hidden' || 
           style.opacity === '0' ||
           element.hidden;
}

function isExternalLink(href) {
    try {
        const url = new URL(href, window.location.href);
        return url.hostname !== window.location.hostname;
    } catch (e) {
        return false;
    }
} 