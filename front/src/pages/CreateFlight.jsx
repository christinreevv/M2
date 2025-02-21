import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateFlight() {
  const navigate = useNavigate();

  const [flightData, setFlightData] = useState({
    flight_name: "",
    launch_date: "",
    landing_date: "",
    launch_site: "",
    landing_site: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData({ ...flightData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Очищаем старые ошибки
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(flightData),
      });

    

      if (response.ok) {  const result = await response.json();
        setMessage(result.message);
        // Перенаправляем на страницу списка рейсов через 2 секунды
        setTimeout(() => {
          navigate("/flights");
        }, 2000);
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Ошибка сети. Проверьте соединение с сервером.");
    }
  };

  return (
    <div className="responsive-wrapper">
      <h1>Создание космического рейса</h1>

      <form className="flight-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название рейса</label>
          <input
            type="text"
            name="flight_name"
            value={flightData.flight_name}
            onChange={handleChange}
            className={errors.flight_name ? "error" : ""}
          />
          {errors.flight_name && <p className="error-text">{errors.flight_name}</p>}
        </div>

        <div className="form-group">
          <label>Дата запуска</label>
          <input
            type="date"
            name="launch_date"
            value={flightData.launch_date}
            onChange={handleChange}
            className={errors.launch_date ? "error" : ""}
          />
          {errors.launch_date && <p className="error-text">{errors.launch_date}</p>}
        </div>

        <div className="form-group">
          <label>Дата посадки</label>
          <input
            type="date"
            name="landing_date"
            value={flightData.landing_date}
            onChange={handleChange}
            className={errors.landing_date ? "error" : ""}
          />
          {errors.landing_date && <p className="error-text">{errors.landing_date}</p>}
        </div>

        <div className="form-group">
          <label>Место запуска</label>
          <input
            type="text"
            name="launch_site"
            value={flightData.launch_site}
            onChange={handleChange}
            className={errors.launch_site ? "error" : ""}
          />
          {errors.launch_site && <p className="error-text">{errors.launch_site}</p>}
        </div>

        <div className="form-group">
          <label>Место посадки</label>
          <input
            type="text"
            name="landing_site"
            value={flightData.landing_site}
            onChange={handleChange}
            className={errors.landing_site ? "error" : ""}
          />
          {errors.landing_site && <p className="error-text">{errors.landing_site}</p>}
        </div>

        <button type="submit" className="base-button">
          Сохранить
        </button>
        <button
          type="button"
          className="base-button"
          onClick={() => navigate("/flights")}
        >
          К списку рейсов
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateFlight;
