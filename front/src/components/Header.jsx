import React from "react";
import { Link } from "react-router-dom";

import '../assets/css/index.css';

const Header = () => {
  // Проверяем, авторизован ли пользователь
  const isAuthenticated = localStorage.getItem("authToken");

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Удаляем токен из localStorage
    window.location.reload(); // Перезагружаем страницу для обновления состояния
  };



  return (
    <header className="header">
      <div className="header-content responsive-wrapper">
        <div className="header-logo">
          <h3> <Link to="/myfiles">File cloud</Link></h3>
        </div>
        <div className="header-navigation">
          <nav className="header-navigation-links">
            {/* Условное рендерирование для авторизованного и неавторизованного пользователя */}
            {!isAuthenticated ? (
              <>
                <Link to="/login">Вход в систему</Link>
                <Link to="/">Регистрация</Link> {/* Показать для не авторизованного */}
              </>
            ) : (
              <a href="#" onClick={handleLogout}>Выйти из аккаунта</a> 
            )}
            <Link to="/loadfiles">Загрузка файлов</Link>
          </nav>
        </div>
        <a className="button">
          <i className="ph-list-bold"></i>
          <span>Menu</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
