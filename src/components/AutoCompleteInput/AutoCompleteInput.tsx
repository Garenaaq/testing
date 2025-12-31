import { useRef, useState, type FC } from "react";

const MAX_SUGGESTIONS = 5;

interface AutoCompleteInputProps {
  options: string[];
  placeholder?: string;
}

export const AutoCompleteInput: FC<AutoCompleteInputProps> = ({
  options,
  placeholder = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setSuggestions(options);
      setShowSuggestions(true);
      return;
    }

    const filtered = options
      .filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))
      .slice(0, MAX_SUGGESTIONS);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.trim() === "") {
      setSuggestions(options);
    } else {
      const filtered = options
        .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, MAX_SUGGESTIONS);
      setSuggestions(filtered);
    }
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log(suggestion);
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: "relative", width: "300px" }} ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        data-testid="auto-complete-input"
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            height: "fit-content",
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #ccc",
            background: "white",
            listStyle: "none",
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onMouseDown={() => handleSuggestionClick(suggestion)}
              data-testid="list-item"
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor: "rgb(133, 133, 133)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgb(180, 180, 180)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgb(133, 133, 133)";
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
