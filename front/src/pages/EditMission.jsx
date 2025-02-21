import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditMission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState({
    title: "",
    launch_date: "",
    landing_date: "",
    launch_site: "",
    landing_site: "",
    latitude: "",
    longitude: "",
    lunar_module: "",
    command_module: "",
    crew: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Загружаем данные миссии при монтировании
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/missions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMission(data);
        }
      })
      .catch(() => setMessage("Ошибка загрузки данных"));
  }, [id]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMission({ ...mission, [name]: value });
  };

  // Отправка обновленных данных миссии
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/missions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(mission),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setMessage(errorData.message || "Ошибка при обновлении");
        }
      }
    } catch (error) {
      setMessage("Ошибка сети. Проверьте соединение с сервером.");
    }
  };

  return (
    <div className="responsive-wrapper">
      <h1>Редактирование миссии</h1>
      {message && <p className="error">{message}</p>}

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Название
          <input
            name="title"
            type="text"
            value={mission.title}
            onChange={handleChange}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <p className="error">{errors.title[0]}</p>}
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
            name="launch_site"
            type="text"
            value={mission.launch_site}
            onChange={handleChange}
            className={errors.launch_site ? "input-error" : ""}
          />
        </label>

        <label>
          Широта
          <input
            name="latitude"
            type="number"
            value={mission.latitude}
            onChange={handleChange}
            className={errors.latitude ? "input-error" : ""}
          />
        </label>

        <label>
          Долгота
          <input
            name="longitude"
            type="number"
            value={mission.longitude}
            onChange={handleChange}
            className={errors.longitude ? "input-error" : ""}
          />
        </label>

        <label>
          Лунный модуль
          <input
            name="lunar_module"
            type="text"
            value={mission.lunar_module}
            onChange={handleChange}
            className={errors.lunar_module ? "input-error" : ""}
          />
        </label>

        <label>
          Управляющий модуль
          <input
            name="command_module"
            type="text"
            value={mission.command_module}
            onChange={handleChange}
            className={errors.command_module ? "input-error" : ""}
          />
        </label>

        <label>
          Экипаж
          <input
            name="crew"
            type="text"
            value={mission.crew}
            onChange={handleChange}
            className={errors.crew ? "input-error" : ""}
          />
        </label>

        <button className="base-button" type="submit">
          Сохранить
        </button>
      </form>

      <button className="secondary-button" onClick={() => navigate("/")}>
        К списку миссий
      </button>
    </div>
  );
}

export default EditMission;
