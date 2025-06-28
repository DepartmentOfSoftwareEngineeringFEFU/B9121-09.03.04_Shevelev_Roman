import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const HeaderContainer = styled.header`
  background-color: #8b4513;
  color: #111111;
  height: 5rem;
  padding: 0 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: #f5f5dc;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  width: 20%;
  color: #f5f5dc;

  &:visited,
  &:active {
    color: #f5f5dc;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 15px;
`;

const StyledNavLink = styled(
  ({ children, to, onClick, className, $isActive }) => {
    if (to) {
      return (
        <Link to={to} className={className}>
          {children}
        </Link>
      );
    } else {
      return (
        <button onClick={onClick} className={className}>
          {children}
        </button>
      );
    }
  }
)`
  text-decoration: none;
  color: #f5f5dc;
  font-weight: 500;
  font-size: 24px;
  transition: color 0.2s ease-in-out;
  display: block;
  padding-bottom: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: #ffd700;
    transition: width 0.3s ease-in-out;

    ${(props) =>
      props.$isActive &&
      `
      width: 100%;
    `}
  }

  &:hover {
    color: #ffd700;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Navigation = styled.nav`
  width: 65%;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  li {
    position: relative;
    overflow: hidden;
    margin: 0 15px;
  }
`;

const AuthButton = styled(motion.button)`
  background-color: #ac4e23;
  color: #f5f5dc;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 16px;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;

  &:hover {
    background-color: #68340f;
  }

  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 8px;
`;

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, userData, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleAuthClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Вы уверены?",
      text: "Вы действительно хотите выйти из аккаунта?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Да, выйти!",
      cancelButtonText: "Отмена",
    });

    if (result.isConfirmed) {
      await logout();
      await Swal.fire("Вышли!", "Вы успешно вышли из аккаунта.", "success");
      window.location.href = "/";
    }
  };

  const navLinks = [
    { path: "/training", label: "Обучение", requireAuth: true },
    { path: "/rules", label: "Правила", requireAuth: false },
    { path: "/profile", label: "Профиль", requireAuth: true },
  ];

  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <LogoImage src="/logo.png" alt="Логотип" />
        <Logo>Шашечный тренажер</Logo>
      </LogoContainer>
      <Navigation>
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              {!link.requireAuth || isLoggedIn ? (
                <StyledNavLink
                  to={link.path}
                  $isActive={location.pathname.startsWith(link.path)}
                >
                  {link.label}
                </StyledNavLink>
              ) : (
                <StyledNavLink
                  onClick={handleAuthClick}
                  $isActive={location.pathname.startsWith(link.path)}
                >
                  {link.label}
                </StyledNavLink>
              )}
            </li>
          ))}
        </ul>
      </Navigation>
      {isLoggedIn && userData ? (
        <AuthButton onClick={handleLogout}>
          <UserAvatar src="/assets/user_avatar.jpg" alt="User Avatar" />
          {userData.Nickname} (Выйти)
        </AuthButton>
      ) : (
        <AuthButton onClick={handleAuthClick}>
          Войти / Зарегистрироваться
        </AuthButton>
      )}
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </HeaderContainer>
  );
};

export default Header;
