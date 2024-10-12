// Function to convert text wrapped in ** to <b>text</b>
function convertToBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const statusMessage = document.getElementById("statusMessage");
  const tosContent = document.getElementById("tosContent");
  const summarizeBtn = document.getElementById("summarizeBtn");
  const expandBtn = document.getElementById("expandBtn");

  tosContent.style.display = "none";  // Hide previous content
  statusMessage.innerText = "Analyzing the page...";

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    // Send a message to the content script to analyze the ToS
    chrome.tabs.sendMessage(activeTab, { action: "analyze" }, (response) => {
      if (response && response.success) {
        // Display the extracted ToS
        statusMessage.innerText = "Terms of Service:";
        tosContent.innerText = response.summary;
        tosContent.style.display = "block";  // Show the ToS

        // Show the "Summarize ToS" and "Expand" buttons
        summarizeBtn.style.display = "block";
        expandBtn.style.display = "block";

        // Store the currently displayed content for expansion
        window.currentContent = response.summary;  // Save the ToS as the current content
      } else {
        statusMessage.innerText = "Failed to analyze the policy.";
      }
    });
  });
});

document.getElementById("summarizeBtn").addEventListener("click", () => {
  const statusMessage = document.getElementById("statusMessage");
  const tosContent = document.getElementById("tosContent");

  if (!window.currentContent) {
    statusMessage.innerText = "Error: No Terms of Service found to summarize.";
    console.log("Error: No data to summarize.");
    return;
  }

  statusMessage.innerText = "Summarizing the ToS...";

  // Send the stored ToS to the Flask backend for summarization
  fetch('http://localhost:5000/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ policyText: window.currentContent }),  // Use the saved ToS for summarization
  })
  .then(response => response.json())
  .then(data => {
    if (data.summary) {
      // Apply bold formatting to the summary
      const formattedSummary = convertToBold(data.summary);

      // Display the formatted summary
      statusMessage.innerText = "Summary:";
      tosContent.innerHTML = formattedSummary;  // Use innerHTML to render the HTML tags properly

      // Update the stored content with the formatted summary
      window.currentContent = formattedSummary;
    } else {
      statusMessage.innerText = "Failed to summarize the policy.";
    }
  })
  .catch(error => {
    console.error('Error during summarization:', error);
    statusMessage.innerText = "Error while summarizing the policy.";
  });
});

document.getElementById("expandBtn").addEventListener("click", () => {
  const statusMessage = document.getElementById("statusMessage");

  if (!window.currentContent) {
    statusMessage.innerText = "Error: No Terms of Service found to expand.";
    console.log("Error: No data to expand.");
    return;
  }

  // Use the current content, whether it's the analyzed ToS or the summarized text
  const tosText = window.currentContent || "No content available";

  const newWindowHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Full Screen ToS</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          margin: 0;
          background-color: #f4f7f6;
        }
        .tos-content {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          max-height: 90vh;
          overflow-y: scroll;
          text-align: left;
          font-size: 14px;
          color: #333;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <h1>Full Screen Terms of Service</h1>
      <div class="tos-content">
        ${tosText.replace(/\n/g, '<br>')}
      </div>
    </body>
    </html>
  `;

  // Open a new window with the current ToS or summary content
  const newWindow = window.open("", "_blank", "width=800,height=600");
  newWindow.document.write(newWindowHtml);
});
