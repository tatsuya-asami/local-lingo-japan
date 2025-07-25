import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [popupMode, setPopupMode] = useState<"full" | "compact">("compact");
  const [disabledUrls, setDisabledUrls] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.sync.get(
      ["translationEnabled", "popupMode", "disabledUrls"],
      (result) => {
        setIsEnabled(result.translationEnabled !== false);
        setPopupMode(result.popupMode || "compact");
        setDisabledUrls(result.disabledUrls || []);
      }
    );
  }, []);

  const toggleEnabled = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    chrome.storage.sync.set({ translationEnabled: newValue });
  };

  const togglePopupMode = () => {
    const newMode = popupMode === "full" ? "compact" : "full";
    setPopupMode(newMode);
    chrome.storage.sync.set({ popupMode: newMode });
  };

  const removeDisabledUrl = (urlToRemove: string) => {
    const newDisabledUrls = disabledUrls.filter((url) => url !== urlToRemove);
    setDisabledUrls(newDisabledUrls);
    chrome.storage.sync.set({ disabledUrls: newDisabledUrls });
  };

  return (
    <div className="popup-container">
      <h2 className="popup-title">Local Lingo Japan</h2>
      <div className="toggle-section">
        <span>選択時にポップアップを表示</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggleEnabled}
            className="toggle-input"
          />
          <span
            className={`toggle-slider ${isEnabled ? "enabled" : "disabled"}`}
          >
            <span
              className={`toggle-slider-button ${
                isEnabled ? "enabled" : "disabled"
              }`}
            ></span>
          </span>
        </label>
      </div>
      {isEnabled && (
        <div className="toggle-section">
          <span>翻訳結果を選択時に表示</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={popupMode === "full"}
              onChange={togglePopupMode}
              className="toggle-input"
            />
            <span
              className={`toggle-slider ${
                popupMode === "full" ? "enabled" : "disabled"
              }`}
            >
              <span
                className={`toggle-slider-button ${
                  popupMode === "full" ? "enabled" : "disabled"
                }`}
              ></span>
            </span>
          </label>
        </div>
      )}
      <p className="description-text">
        ※ 各種機能は右クリックメニューから常に使えます。
      </p>

      {disabledUrls.length > 0 && (
        <div className="disabled-sites-section">
          <h3 className="disabled-sites-title">
            ポップアップが無効化されたサイト
          </h3>
          <div className="disabled-sites-list">
            {disabledUrls.map((url, index) => (
              <div key={index} className="disabled-site-item">
                <span className="disabled-site-url">{url}</span>
                <button
                  onClick={() => removeDisabledUrl(url)}
                  className="remove-button"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
