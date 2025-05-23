// Voice recognition setup
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    
    document.getElementById('voice-input').value = transcript;
    
    if (event.results[0].isFinal) {
      processVoiceCommand(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateStatus('Error: ' + event.error, 'error');
  };
}

// Voice activation
window.electronAPI.onActivateVoice(() => {
  toggleVoice();
});

window.electronAPI.onOpenCommandPalette(() => {
  document.getElementById('command-palette').classList.toggle('hidden');
});

function toggleVoice() {
  if (!recognition) {
    updateStatus('Speech recognition not supported', 'error');
    return;
  }

  if (isListening) {
    recognition.stop();
    isListening = false;
    document.getElementById('voice-btn').classList.remove('listening');
    updateStatus('Stopped listening', 'info');
  } else {
    recognition.start();
    isListening = true;
    document.getElementById('voice-btn').classList.add('listening');
    updateStatus('Listening...', 'success');
  }
}

async function processVoiceCommand(command) {
  updateStatus('Processing: ' + command, 'info');
  
  const result = await window.electronAPI.sendToN8n(command);
  
  if (result.error) {
    updateStatus('Error: ' + result.error, 'error');
  } else {
    updateStatus('Success: Command processed', 'success');
    addToHistory(command, result);
  }
}

function updateStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
}

function addToHistory(command, result) {
  const history = document.getElementById('history');
  const entry = document.createElement('div');
  entry.className = 'history-entry';
  entry.innerHTML = `
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
    <div class="command">${command}</div>
    <div class="result">${JSON.stringify(result, null, 2)}</div>
  `;
  history.insertBefore(entry, history.firstChild);
}

// Test webhook button
document.getElementById('test-webhook').addEventListener('click', async () => {
  const testCommand = 'Test webhook connection';
  await processVoiceCommand(testCommand);
});