chrome.runtime.onInstalled.addListener(() => {
    console.log("Terms of Service Analyzer installed.");
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
      let storageChange = changes[key];
      console.log(`Storage key "${key}" in namespace "${namespace}" changed. Old value: ${storageChange.oldValue}, new value: ${storageChange.newValue}`);
    }
  });
  