import React, { useState } from "react";
import Header from "../components/Header";

function Register() {
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.lastName || !formData.firstName || !formData.email || !formData.password) {
      setMessage("Все поля обязательны для заполнения");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
         method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Регистрация прошла успешно!");
        setFormData({ lastName: "", firstName: "", email: "", password: "" });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Ошибка сети. Проверьте соединение с сервером.");
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="responsive-wrapper">
          <h1>Регистрация</h1>
          <form className="registration card" onSubmit={handleSubmit}>
            <label>
              Фамилия
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Имя
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Почта
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Пароль
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <button className="base-button" type="submit">
              Зарегистрироваться
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </main>
    </>
  );
}

export default Register;
