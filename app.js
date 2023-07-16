const generateButton = document.getElementById('generate');
const toggleAudioButton = document.getElementById('toggleAudio');
const outputElement = document.getElementById('output');
const promptElement = document.getElementById('prompt');
let audioEnabled = false;
let isListeningForCommand = false;
let wakeWord = '';

// Initialize SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', async (event) => {
  const transcript = Array.from(event.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  promptElement.value = transcript;

  // If we're listening for the wake word
  if (!isListeningForCommand) {
    if (transcript.includes('hey gpt')) {
      wakeWord = 'Hey GPT';
      isListeningForCommand = true;
    } else if (transcript.includes('hey agi')) {
      wakeWord = 'Hey AGI';
      isListeningForCommand = true;
    }
  } else if (event.results[0].isFinal) {
    const prompt = transcript;

    const response = await fetch('http://localhost:6000/api/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wake_word: wakeWord, prompt }),
    });

    const data = await response.json();

    outputElement.value = data.text;

    if (audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(data.text);
      window.speechSynthesis.speak(utterance);
    }

    isListeningForCommand = false;
  }
});

recognition.addEventListener('end', recognition.start);

generateButton.addEventListener('click', () => {
  recognition.start();
});

toggleAudioButton.addEventListener('click', () => {
  audioEnabled = !audioEnabled;
});

recognition.start();
