import React, { useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResults([]);

    if (!query.trim()) {
      setError("Введите поисковой запрос");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search?query=${query}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "Ошибка при поиске");
      }
    } catch (error) {
      setError("Ошибка сети. Проверьте соединение с сервером.");
    }
  };

  return (
    <div className="responsive-wrapper">
      <h1>Поиск миссий и пилотов</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Введите название миссии или имя пилота"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="base-button" onClick={handleSearch}>
          Найти
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="search-results">
        {results.length > 0 ? (
          results.map((mission) => (
            <div key={mission.id} className="mission-card">
              <h2>{mission.title}</h2>
              <p><strong>Экипаж:</strong> {mission.crew}</p>
              <p><strong>Дата запуска:</strong> {mission.launch_date}</p>
              <p><strong>Дата посадки:</strong> {mission.landing_date}</p>
              <p><strong>Место запуска:</strong> {mission.launch_site}</p>
              <p><strong>Место посадки:</strong> {mission.landing_site}</p>
            </div>
          ))
        ) : (
          <p>Ничего не найдено</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
