chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyze") {
      const bodyText = document.body.innerText || "";
      const terms = extractTermsOfService(bodyText);
  
      if (terms) {
        sendResponse({ success: true, termsOfService: terms });
      } else {
        sendResponse({ success: false });
      }
  
      return true; // Keeps the message channel open for async response
    }
  });
  
  // Enhanced function to extract surrounding text from the first occurrence of "Terms of Service"
  function extractTermsOfService(text) {
    const termsRegex = /(terms\s+(of|&)\s+service|terms\s+and\s+conditions|user\s+agreement)/gi;
    
    // Search for the first occurrence of the regex
    const startIndex = text.search(termsRegex);
  
    if (startIndex !== -1) {
      // Extract a portion of the text, starting from the first occurrence and getting surrounding context
      return text.slice(startIndex, startIndex + 10000);  // Extract up to 10,000 characters
    }
  
    return "No Terms of Service found.";
  }
  