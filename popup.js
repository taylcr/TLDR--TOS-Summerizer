document.getElementById("analyzeBtn").addEventListener("click", () => {
  const statusMessage = document.getElementById("statusMessage");
  const tosContent = document.getElementById("tosContent");

  tosContent.style.display = "none";  // Hide previous content
  statusMessage.innerText = "Analyzing the page...";

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    // Send a message to the content script
    chrome.tabs.sendMessage(activeTab, { action: "analyze" }, (response) => {
      if (response && response.success) {
        // Display the summarized ToS from ChatGPT
        statusMessage.innerText = "Summary:";
        tosContent.innerText = response.summary;
        tosContent.style.display = "block";  // Show the extracted summary
      } else {
        statusMessage.innerText = "Failed to analyze the policy.";
      }
    });
  });
});
