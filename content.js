chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyze") {
      const bodyText = document.body.innerText || "";
      const terms = extractTermsOfService(bodyText);
  
      console.log("Extracted terms:", terms);  // Log the extracted ToS text
  
      if (terms) {
        // Send the extracted ToS to the Flask backend for ChatGPT analysis
        fetch('http://localhost:5000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ policyText: terms }),
        })
        .then(response => response.json())
        .then(data => {
          console.log("Response from backend:", data);  // Log the response from Flask
  
          if (data.summary) {
            sendResponse({ success: true, summary: data.summary });
          } else {
            sendResponse({ success: false });
          }
        })
        .catch(error => {
          console.error('Error in fetch:', error);
          sendResponse({ success: false });
        });
      } else {
        sendResponse({ success: false });
      }
    }
  
    return true;  // Keeps the message channel open for async response
  });
  