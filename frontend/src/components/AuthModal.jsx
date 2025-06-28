import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/AuthContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #f5f5dc;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
`;

const ModalHeader = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #8b4513;
  font-family: "Montserrat", sans-serif;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #a0522d;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  padding-right: 35px;
  margin-bottom: 5px;

  &::placeholder {
    color: #a0522d;
    opacity: 0.7;
  }
`;

const EyeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 45%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #a0522d;
`;

const Button = styled.button`
  background-color: #a0522d;
  color: #f5f5dc;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #ffd700;
    color: #8b4513;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AuthToggle = styled.p`
  text-align: center;
  margin-top: 15px;
  color: #a0522d;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  font-family: "Montserrat", sans-serif;

  span {
    cursor: pointer;
    text-decoration: underline;
    color: #8b4513;

    &:hover {
      color: #bb9f00;
    }
  }
`;

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
    setIdentifier("");
    setEmail("");
    setPassword("");
    setNickname("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowPasswordRegister(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const response = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier, password }),
        });

        if (response.ok) {
          const data = await response.json();
          login(data.token, data.userId, data.nickname);
          onClose();
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Ошибка авторизации",
            text: errorData.message || "Неверный email или пароль",
          });
        }
      } else {
        if (password !== confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Ошибка регистрации",
            text: "Пароли не совпадают. Пожалуйста, проверьте введенные данные.",
          });
          return;
        }

        const response = await fetch("/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickname, email, password, confirmPassword }),
        });

        const errorData = await response.json();

        if (
          response.status === 409 &&
          errorData.message === "Этот email уже занят"
        ) {
          Swal.fire({
            icon: "error",
            title: "Ошибка регистрации",
            text: "Этот email уже занят. Пожалуйста, используйте другой email.",
          });
        } else if (
          response.status === 409 &&
          errorData.message === "Этот никнейм уже занят"
        ) {
          Swal.fire({
            icon: "error",
            title: "Ошибка регистрации",
            text: "Этот никнейм уже занят. Пожалуйста, выберите другой никнейм.",
          });
        } else if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Успешно!",
            text: "Вы успешно зарегистрировались!",
          });
          onClose();
          setIsLogin(true);

          setIdentifier("");
          setEmail("");
          setPassword("");
          setNickname("");
          setConfirmPassword("");
          setShowPassword(false);
          setShowPasswordRegister(false);
          setShowConfirmPassword(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Ошибка регистрации",
            text: errorData.message || "Произошла ошибка при регистрации",
          });
        }
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      Swal.fire({
        icon: "error",
        title: "Ошибка сети",
        text: "Произошла ошибка сети. Пожалуйста, попробуйте позже.",
      });
    }
  };

  const toggleShowPasswordLogin = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordRegistration = () => {
    setShowPasswordRegister(!showPasswordRegister);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>{isLogin ? "Авторизация" : "Регистрация"}</ModalHeader>
        <form onSubmit={handleSubmit}>
          {!isLogin ? (
            <>
              <Input
                type="text"
                placeholder="Отображаемый никнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputWrapper>
                <Input
                  type={showPasswordRegister ? "text" : "password"}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeIcon
                  icon={showPasswordRegister ? faEyeSlash : faEye}
                  onClick={toggleShowPasswordRegistration}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <EyeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  onClick={toggleShowConfirmPassword}
                />
              </InputWrapper>
            </>
          ) : (
            <>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Email или никнейм"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <EyeIcon />
              </InputWrapper>
              <InputWrapper>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={toggleShowPasswordLogin}
                />
              </InputWrapper>
            </>
          )}
          <ButtonContainer>
            <Button type="submit">
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </ButtonContainer>
          <AuthToggle>
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <span onClick={handleToggleAuth}>
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </span>
          </AuthToggle>
        </form>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

export default AuthModal;
