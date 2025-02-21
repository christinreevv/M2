import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password) {
        setMessage("Все поля обязательны для заполнения");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            setMessage("Вход выполнен успешно!");
            localStorage.setItem("authToken", result.token);  // Сохранение токена
            console.log("Пользователь:", result.user);
            navigate("/myfiles");
        } else {
            const errorData = await response.json();
            setMessage(errorData.message || "Ошибка входа");
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
          <h1>Вход в систему</h1>
          <form className="registration card" onSubmit={handleSubmit} method="POST">
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
              Войти
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </main>
    </>
  );
}

export default Login;
