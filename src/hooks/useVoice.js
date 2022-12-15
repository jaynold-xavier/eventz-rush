import { useState, useEffect } from "react";
import { message } from "antd";

let speech;
if (window.webkitSpeechRecognition) {
  // eslint-disable-next-line
  const SpeechRecognition = webkitSpeechRecognition;
  speech = new SpeechRecognition();
  speech.continuous = true;
} else {
  speech = null;
}

export default function useVoice() {
  const [text, setText] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!speech) {
      return;
    }

    speech.onresult = (event) => {
      // processing
      let textData = event.results[event.results.length - 1][0].transcript;
      if (textData) {
        textData = textData.trim().replace(".", "");
      }

      // set text
      setText(textData);

      // cleanup
      setIsListening(false);
      speech.stop();
    };
  }, []);

  const listen = () => {
    setIsListening(!isListening);

    if (isListening) {
      speech.stop();
    } else {
      message.info("Listening...");
      speech.start();
    }
  };

  return {
    text,
    setText,
    isListening,
    listen,
    voiceSupported: speech !== null,
  };
}
