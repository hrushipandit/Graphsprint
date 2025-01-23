import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [query, setQuery] = useState(""); // Stores the user input
  const [response, setResponse] = useState(""); // Stores the API response
  const [loading, setLoading] = useState(false); // Loading state for API request
  const [error, setError] = useState(""); // Error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous error
    setResponse(""); // Clear previous response

    try {
      const res = await axios.get("http://localhost:8000/query", {
        params: { query },
      });

      // Extract response output correctly from the API response
      if (res.data && res.data.response && res.data.response.output) {
        setResponse(res.data.response.output);
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      setError("Failed to fetch response. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Chat with RAG</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Type your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "80%",
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
