import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MissionList() {
  const [missions, setMissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/missions")
      .then((res) => res.json())
      .then(setMissions)
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/missions/${id}`, { method: "DELETE" })
      .then(() => setMissions(missions.filter((mission) => mission.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="responsive-wrapper">
      <h1>Список миссий</h1>
      <button onClick={() => navigate("/add-mission")}>Добавить миссию</button>
      {missions.map((mission) => (
        <div key={mission.id} className="accordion">
          <div className="accordion-title">
            {mission.title}
            <button onClick={() => handleDelete(mission.id)}>🗑️</button>
            <button onClick={() => navigate(`/edit-mission/${mission.id}`)}>✏️</button>
          </div>
          <div className="accordion-content">
            <p>Дата запуска: {mission.launch_date}</p>
            <p>Дата посадки: {mission.landing_date}</p>
            <p>Место запуска: {mission.launch_site}</p>
            <p>Широта: {mission.latitude}, Долгота: {mission.longitude}</p>
            <p>Место посадки: {mission.landing_site}</p>
            <p>Лунный модуль: {mission.lunar_module}</p>
            <p>Управляющий модуль: {mission.command_module}</p>
            <p>Экипаж: {mission.crew}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MissionList;
