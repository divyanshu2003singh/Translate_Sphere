import React, { useEffect, useState } from "react";
import './Translate.css';
import countries from "./data";

const Translate = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [selectTags, setSelectTags] = useState([]);
  const [translateFrom, setTranslateFrom] = useState("en-GB");
  const [translateTo, setTranslateTo] = useState("hi-IN");

  useEffect(() => {
    const selectTags = document.querySelectorAll("select");
    setSelectTags(selectTags);

    selectTags.forEach((tag, id) => {
      for (let country_code in countries) {
        let selected =
          id === 0
            ? country_code === "en-GB"
              ? "selected"
              : ""
            : country_code === "hi-IN"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });
  }, []);

  const handleExchangeLanguages = () => {
    let tempText = fromText;
    setFromText(toText);
    setToText(tempText);
    setTranslateFrom(selectTags[0].value);
    setTranslateTo(selectTags[1].value);
  };

  const handleTranslate = async () => {
    if (!fromText) return;

    setToText("Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${translateFrom}|${translateTo}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      setToText(data.responseData.translatedText);
      data.matches.forEach((data) => {
        if (data.id === 0) {
          setToText(data.translation);
        }
      });
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleTextToSpeech = (type) => {
    if (type === 'from') {
      const utterance = new SpeechSynthesisUtterance(fromText);
      utterance.lang = translateFrom;
      speechSynthesis.speak(utterance);
    } else {
      const utterance = new SpeechSynthesisUtterance(toText);
      utterance.lang = translateTo;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCopyToClipboard = (type) => {
    const textToCopy = type === 'from' ? fromText : toText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log(`Copied to Clipboard for ${type}`))
      .catch((err) => console.error('Copy to Clipboard failed', err));
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter text"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          ></textarea>
          <textarea
            spellCheck="false"
            readOnly
            disabled
            className="to-text"
            placeholder="Translation"
            value={toText}
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i
                id="from"
                className="fas fa-volume-up"
                onClick={() => handleTextToSpeech("from")}
              ></i>
              <i
                id="from"
                className="fas fa-copy"
                onClick={() => handleCopyToClipboard("from")}
              ></i>
            </div>
            <select
              value={translateFrom}
              onChange={(e) => setTranslateFrom(e.target.value)}
            ></select>
          </li>
          <li className="exchange" onClick={handleExchangeLanguages}>
            <i className="fas fa-exchange-alt"></i>
          </li>
          <li className="row to">
            <select
              value={translateTo}
              onChange={(e) => setTranslateTo(e.target.value)}
            ></select>
            <div className="icons">
              <i
                id="to"
                className="fas fa-volume-up"
                onClick={() => handleTextToSpeech("to")}
              ></i>
              <i
                id="to"
                className="fas fa-copy"
                onClick={() => handleCopyToClipboard("to")}
              ></i>
            </div>
          </li>
        </ul>
      </div>
      <button onClick={handleTranslate}>Translate Text</button>
    </div>
  );
};

export default Translate;
