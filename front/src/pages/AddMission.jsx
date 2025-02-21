import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMission() {
  const navigate = useNavigate();
  const [mission, setMission] = useState({
    mission_name: "",
    launch_date: "",
    landing_date: "",
    launch_site_name: "",
    landing_site_name: "",
    landing_latitude: "",
    landing_longitude: "",
    cosmonaut_1_name: "",
    cosmonaut_1_role: "",
    crew_capacity: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMission({ ...mission, [name]: value });
  };

  // Отправка данных новой миссии
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/api/lunar-missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(mission),
      });

      if (response.ok) {
        setModalOpen(true);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setMessage(errorData.message || "Ошибка при создании");
        }
      }
    } catch (error) {
      setMessage("Ошибка сети. Проверьте соединение с сервером.");
    }
  };

  return (
    <div className="responsive-wrapper">
      <h1>Создание миссии</h1>
      {message && <p className="error">{message}</p>}

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Название
          <input
            name="mission_name"
            type="text"
            value={mission.mission_name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error">{errors.name[0]}</p>}
        </label>

        <label>
          Дата запуска
          <input
            name="launch_date"
            type="date"
            value={mission.launch_date}
            onChange={handleChange}
            className={errors.launch_date ? "input-error" : ""}
          />
          {errors.launch_date && <p className="error">{errors.launch_date[0]}</p>}
        </label>

        <label>
          Дата посадки
          <input
            name="landing_date"
            type="date"
            value={mission.landing_date}
            onChange={handleChange}
            className={errors.landing_date ? "input-error" : ""}
          />
          {errors.landing_date && <p className="error">{errors.landing_date[0]}</p>}
        </label>

        <label>
          Место запуска
          <input
            name="launch_site_name"
            type="text"
            value={mission.launch_site_name}
            onChange={handleChange}
            className={errors.launch_site ? "input-error" : ""}
          />
        </label>

        <label>
          Широта
          <input
            name="landing_latitude"
            type="number"
            value={mission.landing_latitude}
            onChange={handleChange}
            className={errors.latitude ? "input-error" : ""}
          />
        </label>

        <label>
          Долгота
          <input
            name="landing_longitude"
            type="number"
            value={mission.landing_longitude}
            onChange={handleChange}
            className={errors.longitude ? "input-error" : ""}
          />
        </label>

        <label>
          Лунный модуль
          <input
            name="cosmonaut_1_name"
            type="text"
            value={mission.cosmonaut_1_name}
            onChange={handleChange}
            className={errors.lunar_module ? "input-error" : ""}
          />
        </label>

        <label>
          Управляющий модуль
          <input
            name="cosmonaut_1_role"
            type="text"
            value={mission.cosmonaut_1_role}
            onChange={handleChange}
            className={errors.command_module ? "input-error" : ""}
          />
        </label>

        <label>
          Экипаж
          <input
            name="crew_capacity"
            type="text"
            value={mission.crew_capacity}
            onChange={handleChange}
            className={errors.crew ? "input-error" : ""}
          />
        </label>

        <button className="base-button" type="submit">
          Сохранить
        </button>
      </form>
{message && (<p>{message}</p>)}
      <button className="secondary-button" onClick={() => navigate("/")}>
        К списку миссий
      </button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Миссия успешно добавлена!</p>
            <button onClick={() => navigate("/")}>ОК</button>
          </div>
        </div>
      )}                                                                                                    
    </div>
  );
}

export default AddMission;
