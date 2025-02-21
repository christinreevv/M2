import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FlightsList() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Получаем список рейсов для авторизованного пользователя
    const fetchFlights = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/flights", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // токен пользователя
        },
      });
      const data = await response.json();
      setFlights(data);
    };

    fetchFlights();
  }, []);

  const handleRegister = async (flightId) => {
    // Отправляем запрос на регистрацию на рейс
    const response = await fetch(
      `http://127.0.0.1:8000/api/flights/${flightId}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const result = await response.json();

    if (response.ok) {
      setSuccessMessage(result.message);
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="responsive-wrapper">
      <h1>Список космических рейсов</h1>
      
      {flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <h3>{flight.flight_name}</h3>
            <p>Место прибытия: {flight.landing_site}</p>
            <p>Дата запуска: {flight.launch_date}</p>
            <p>Количество мест: {flight.total_seats}</p>
            <p>Занято мест: {flight.seats_taken}</p>

            <button
              onClick={() => handleRegister(flight.id)}
              className="base-button"
              disabled={flight.seats_taken >= flight.total_seats}
            >
              Записаться
            </button>
          </div>
        ))
      ) : (
        <p>Нет доступных рейсов</p>
      )}

      <button onClick={() => navigate("/flights/create")} className="base-button">
        Добавить рейс
      </button>

      <button onClick={() => navigate("/")} className="base-button">
        На главную страницу
      </button>

      {/* Модальное окно для уведомления */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{successMessage || errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightsList;
