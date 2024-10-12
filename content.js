chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyze") {
      const bodyText = document.body.innerText || "";
      const terms = extractTermsOfService(bodyText);
  
      if (terms) {
        sendResponse({ success: true, summary: terms });
      } else {
        sendResponse({ success: false });
      }
    }
  });
  
  function extractTermsOfService(text) {
    // Look for "Terms of Service" or similar phrases in the text
    const termsRegex = /(terms\s+(of|&)\s+service|terms\s+and\s+conditions|user\s+agreement)/gi;
    const startIndex = text.search(termsRegex);
  
    if (startIndex !== -1) {
      // Return a portion of the text, starting from the first occurrence
      return text.slice(startIndex, startIndex + 10000);  // Extract up to 10,000 characters for now
    }
  
    return "No Terms of Service found.";
  }
  