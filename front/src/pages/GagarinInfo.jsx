import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Импорт useNavigate
import Header from "../components/Header";

function GagarinInfo() {
  const [gagarin, setGagarin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Используем useNavigate

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/gagarin")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        return res.json();
      })
      .then(setGagarin)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <div className="responsive-wrapper">
          <h1>Информация о Гагарине</h1>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : gagarin ? (
            <div className="card">
              <p><strong>Имя:</strong> {gagarin.name}</p>
              <p><strong>Дата рождения:</strong> {gagarin.birth_date}</p>
              <p><strong>Миссия:</strong> {gagarin.mission}</p>
              <p><strong>Дата полёта:</strong> {gagarin.flight_date}</p>
              <p><strong>Корабль:</strong> {gagarin.spacecraft}</p>
              <p><strong>Продолжительность:</strong> {gagarin.duration}</p>
              <button className="base-button" onClick={() => navigate("/missions")}>
                К списку миссий
              </button>
            </div>
          ) : (
            <p>Загрузка...</p>
          )}
        </div>
      </main>
    </>
  );
}

export default GagarinInfo;
