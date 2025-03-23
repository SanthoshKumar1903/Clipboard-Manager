import React, { useState, useEffect } from 'react';
import './Styles.css'
const ClipboardManager = () => {
  const [currentClipboard, setCurrentClipboard] = useState('Loading current clipboard...');
  const [clipboardHistory, setClipboardHistory] = useState([]);

  const updateClipboardContent = async () => {
    try {
      const text = await window.electronAPI.getClipboardContent();
      setCurrentClipboard(text || "Clipboard is empty");
    } catch (error) {
      console.error("Error fetching clipboard content:", error);
      setCurrentClipboard("Error fetching clipboard");
    }
  };

  const updateClipboardHistory = async () => {
    try {
      const history = await window.electronAPI.getClipboardHistory();
      const trimmedHistory = history.map(item => item.trim()).filter((item, index,self) => self.indexOf(item) === index);
      setClipboardHistory(trimmedHistory);
    } catch (error) {
      console.error("Error fetching clipboard history:", error);
    }
  };


  const clearClipboardHistory = async () => {
    try {
      await window.electronAPI.clearClipboardHistory();
      updateClipboardHistory();
    } catch (error) {
      console.error("Error clearing clipboard history:", error);
    }
  };

  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  useEffect(() => {
    updateClipboardContent();
    updateClipboardHistory();
    const historyInterval = setInterval(updateClipboardHistory, 2000);
    const clipboardInterval = setInterval(updateClipboardContent,3000);
    return () => {
      clearInterval(historyInterval); 
      clearInterval(clipboardInterval);
    }
  }, []);

  const addToHistory = (entry) => {
    const trimmedEntry = entry.trim();
    if(!clipboardHistory.includes(trimmedEntry)){
      setClipboardHistory(prevHistory => [...prevHistory, trimmedEntry]);
    }
  };
  
  useEffect(()=> {
    const interval = setInterval(()=> {
      const currentText = currentClipboard.trim();
      addToHistory(currentText);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentClipboard]);

  return (
    <div>
      <div>
        <button 
          id="refresh-button" 
          onClick={updateClipboardContent} 
          className='button'
        >
          Refresh Current Clipboard
        </button>
        <span id="current-clipboard">{currentClipboard}</span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button 
          id="refresh-history-button" 
          onClick={updateClipboardHistory} 
          className='button'
        >
          Refresh History
        </button>
        <button 
          id="clear-history-button" 
          onClick={clearClipboardHistory} 
          className='button'
        >
          Clear History
        </button>
      </div>

      <div id="clipboard-history" style={{ marginTop: '1rem' }}>
        {clipboardHistory.map((entry, index) => (
          <div key={index} className='entry'>
            <div className='content'>{entry}</div>
            <button 
              onClick={() => copyToClipboard(entry)} 
              className='copy-button'
            >
              <svg xmlns="http://www.w3.org/2000/svg" widht="22" height="22" 
              gap="2px" fill="none" viewBox="0 0 23 23" strokeWidth="1.5" stroke="currentColor" class="size-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>

              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClipboardManager;