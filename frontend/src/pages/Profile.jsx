import React, { useContext, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useTrainingProgress from "../hooks/useTrainingProgress";
import Swal from "sweetalert2";

import StatisticCard from "../components/StatisticCard";

import {
  faCrown,
  faGamepad,
  faTrophy,
  faTimesCircle,
  faHandshake,
  faBook,
  faQuestionCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const CardsGridContainer = styled.div`
  display: grid;
  gap: 24px;
  width: 100%;
  max-width: 960px;
  margin: 20px auto;
  padding: 0 15px;

  grid-template-columns: 1fr;
  grid-template-areas:
    "rating"
    "games"
    "wins"
    "losses"
    "draws"
    "lessons"
    "problems"
    "profile";

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "rating rating"
      "games wins"
      "losses draws"
      "lessons problems"
      "profile profile";
  }

  justify-items: stretch;
  align-items: stretch;
`;

const RatingCard = styled(StatisticCard)``;

// Карточка профиля
const ProfileCard = styled.div`
  background: rgba(160, 82, 45, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 32px 28px;
  min-width: 400px;
  max-width: 520px;
  margin: 40px auto 0;
  color: #f5f5dc;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ProfileLabel = styled.label`
  font-size: 1.1rem;
  color: #ffd700;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 90%;
  padding: 12px;
  border: 1.5px solid #a0522d;
  border-radius: 6px;
  font-size: 1.1rem;
  margin-bottom: 18px;
  background: #fff;
  color: #8b4513;
  font-family: "Montserrat", sans-serif;
  transition: border-color 0.2s;
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  background-color: #ffd700;
  color: #8b4513;
  border: none;
  padding: 12px 0;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  flex: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #a0522d;
    color: #fff;
  }
  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  background: ${({ success }) => (success ? "#4caf50" : "#f44336")};
  color: #fff;
  text-align: center;
  font-weight: 500;
`;

const ProfileInfoRow = styled.div`
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: #ffd700;
  display: flex;
  justify-content: space-between;
`;

const GroupsSection = styled.div`
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 18px 16px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.1);
`;

const GroupTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 12px;
`;

const GroupList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
`;

const GroupItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px 14px;
  color: #fffbe6;
  font-size: 1.05rem;
`;

const CreateGroupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const SmallInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1.5px solid #a0522d;
  font-size: 1rem;
  background: #fff;
  color: #8b4513;
  font-family: "Montserrat", sans-serif;
`;

const SmallButton = styled.button`
  background: #ffd700;
  color: #8b4513;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #a0522d;
    color: #fff;
  }
`;

const InvitesSection = styled.div`
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 18px 16px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.1);
`;

const InviteTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 12px;
`;

const InviteList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
`;

const InviteItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px 14px;
  color: #fffbe6;
  font-size: 1.05rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InviteButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 6px;
`;

const InviteUserForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  background: rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 10px 12px;
`;

const AutocompleteList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fffbe6;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.13);
  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 160px;
  overflow-y: auto;
`;

const AutocompleteItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  color: #8b4513;
  &:hover {
    background: #ffd700;
    color: #a0522d;
  }
`;

const Profile = () => {
  const { isLoggedIn, userData, fetchUserData } = useContext(AuthContext);
  const progress = useTrainingProgress();

  const [nickname, setNickname] = useState(userData?.Nickname || "");
  const [email, setEmail] = useState(userData?.Email || "");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [trainerRequestLoading, setTrainerRequestLoading] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [invites, setInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [inviteFormGroupId, setInviteFormGroupId] = useState(null);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteSuggestions, setInviteSuggestions] = useState([]);
  const [selectedInviteUser, setSelectedInviteUser] = useState(null);
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const fetchInvites = async () => {
    setInvitesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/group-invites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      } else {
        setInvites([]);
      }
    } catch {
      setInvites([]);
    } finally {
      setInvitesLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvites();
  }, []);

  if (!userData) {
    return <div>Загрузка данных профиля...</div>;
  }

  const handleEdit = () => {
    setEditMode(true);
    setMessage("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setNickname(userData.Nickname);
    setEmail(userData.Email);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname, email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Данные успешно обновлены");
        setEditMode(false);
        fetchUserData(userId);
      } else {
        setMessage(data.message || "Ошибка обновления");
      }
    } catch (error) {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerRequest = async () => {
    const result = await Swal.fire({
      title: "Подтвердите действие",
      text: "Вы действительно хотите подать заявку на роль тренера?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да, подать заявку",
      cancelButtonText: "Отмена",
    });
    if (result.isConfirmed) {
      setTrainerRequestLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/users/request-trainer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          await Swal.fire({
            icon: "success",
            title: "Заявка отправлена",
            text:
              data.message ||
              "Ваша заявка на роль тренера отправлена и будет рассмотрена администратором.",
          });
          fetchUserData(localStorage.getItem("userId"));
        } else {
          Swal.fire({
            icon: "error",
            title: "Ошибка",
            text:
              data.message || "Не удалось отправить заявку. Попробуйте позже.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ошибка сети",
          text: "Не удалось отправить заявку. Попробуйте позже.",
        });
      } finally {
        setTrainerRequestLoading(false);
      }
    }
  };

  const fetchGroups = async () => {
    setGroupsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/trainer/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      } else {
        setGroups([]);
      }
    } catch {
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleShowGroups = () => {
    setShowGroups((prev) => !prev);
    if (!showGroups) fetchGroups();
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/trainer/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreateForm(false);
        setNewGroupName("");
        setNewGroupDesc("");
        fetchGroups();
        Swal.fire({ icon: "success", title: "Группа создана" });
      } else {
        Swal.fire({ icon: "error", title: "Ошибка", text: data.message });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Ошибка", text: "Ошибка сети" });
    }
  };

  const handleAcceptInvite = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/group-invites/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Вы вступили в группу" });
        fetchInvites();
      } else {
        Swal.fire({ icon: "error", title: "Ошибка", text: data.message });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Ошибка", text: "Ошибка сети" });
    }
  };

  const handleDeclineInvite = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/group-invites/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "info", title: "Приглашение отклонено" });
        fetchInvites();
      } else {
        Swal.fire({ icon: "error", title: "Ошибка", text: data.message });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Ошибка", text: "Ошибка сети" });
    }
  };

  const handleOpenInviteForm = (groupId) => {
    setInviteFormGroupId(groupId);
    setInviteInput("");
    setInviteSuggestions([]);
    setSelectedInviteUser(null);
    setInviteError("");
  };

  const handleInviteInputChange = async (e) => {
    const value = e.target.value;
    setInviteInput(value);
    setInviteSuggestions([]);
    setSelectedInviteUser(null);
    setInviteError("");
    if (value.length < 3) return;
    setInviteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/users/search?query=${encodeURIComponent(value)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInviteSuggestions(data);
      } else {
        setInviteSuggestions([]);
      }
    } catch {
      setInviteSuggestions([]);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleSelectInviteUser = (user) => {
    setSelectedInviteUser(user);
    setInviteInput(user.Nickname + (user.Email ? ` (${user.Email})` : ""));
    setInviteSuggestions([]);
    setInviteError("");
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedInviteUser || !inviteFormGroupId) {
      setInviteError("Выберите пользователя из списка");
      return;
    }
    setInviteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/users/trainer/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ groupId: inviteFormGroupId, userId: selectedInviteUser.ID }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Приглашение отправлено" });
        setInviteFormGroupId(null);
        setInviteInput("");
        setSelectedInviteUser(null);
      } else {
        setInviteError(data.message || "Ошибка отправки приглашения");
      }
    } catch {
      setInviteError("Ошибка сети");
    } finally {
      setInviteLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <CardsGridContainer>
        <motion.div variants={itemVariants} style={{ gridArea: "rating" }}>
          <RatingCard label="Рейтинг" value={userData.Rating} icon={faCrown} />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "games" }}>
          <StatisticCard
            label="Сыграно игр"
            value={userData.GamesPlayed}
            icon={faGamepad}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "lessons" }}>
          <StatisticCard
            label="Пройдено уроков"
            value={`${progress.lessons.completed} / ${progress.lessons.total}`}
            icon={faBook}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "problems" }}>
          <StatisticCard
            label="Решено задач"
            value={`${progress.problems.completed} / ${progress.problems.total}`}
            icon={faQuestionCircle}
          />
        </motion.div>
        <motion.div variants={itemVariants} style={{ gridArea: "wins" }}>
          <StatisticCard label="Побед" value={userData.Wins} icon={faTrophy} />
        </motion.div>

        <motion.div variants={itemVariants} style={{ gridArea: "losses" }}>
          <StatisticCard
            label="Поражений"
            value={userData.Losses}
            icon={faTimesCircle}
          />
        </motion.div>

        <motion.div variants={itemVariants} style={{ gridArea: "draws" }}>
          <StatisticCard
            label="Ничьих"
            value={userData.Draws}
            icon={faHandshake}
          />
        </motion.div>
        <ProfileCard style={{ gridArea: "profile" }}>
          {editMode ? (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ProfileLabel htmlFor="nickname">Никнейм:</ProfileLabel>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                disabled={loading}
                autoComplete="off"
              />
              <ProfileLabel htmlFor="email">Email:</ProfileLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="off"
              />
              <ButtonRow>
                <Button type="submit" disabled={loading}>
                  Сохранить
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    background: "#fff",
                    color: "#a0522d",
                    border: "1.5px solid #ffd700",
                  }}
                >
                  Отмена
                </Button>
              </ButtonRow>
              {message && (
                <Message success={message.includes("успешно")}>
                  {message}
                </Message>
              )}
            </form>
          ) : (
            <>
              <ProfileInfoRow>
                <span>
                  <b>Никнейм:</b>
                </span>
                <span>{userData.Nickname}</span>
              </ProfileInfoRow>
              <ProfileInfoRow>
                <span>
                  <b>Email:</b>
                </span>
                <span>{userData.Email}</span>
              </ProfileInfoRow>
              <Button style={{ marginTop: 8 }} onClick={handleEdit}>
                Редактировать профиль
              </Button>
              {message && (
                <Message success={message.includes("успешно")}>
                  {message}
                </Message>
              )}
              {/* Кнопка для подачи заявки на тренера */}
              {!editMode && userData.Role === "User" && (
                <Button
                  style={{
                    marginTop: 16,
                    background: "#4caf50",
                    color: "#fff",
                  }}
                  onClick={handleTrainerRequest}
                  disabled={trainerRequestLoading}
                >
                  Стать тренером
                </Button>
              )}
              {/* Статус заявки */}
              {!editMode && userData.Role === "PendingTrainer" && (
                <Message
                  success={false}
                  style={{
                    background: "#ffa726",
                    color: "#fff",
                    marginTop: 16,
                  }}
                >
                  Ваша заявка на роль тренера рассматривается
                </Message>
              )}
              {!editMode && userData.Role === "Trainer" && (
                <Message
                  success={true}
                  style={{
                    background: "#4caf50",
                    color: "#fff",
                    marginTop: 16,
                  }}
                >
                  Вы являетесь тренером
                </Message>
              )}
              {/* Кнопка для тренера: группы */}
              {!editMode && userData.Role === "Trainer" && (
                <SmallButton
                  style={{
                    marginTop: 16,
                    background: showGroups ? "#a0522d" : "#ffd700",
                    color: showGroups ? "#fff" : "#8b4513",
                  }}
                  onClick={handleShowGroups}
                >
                  <i className="fas fa-users" style={{ marginRight: 8 }}></i>
                  Группы
                </SmallButton>
              )}
              {/* Список групп тренера */}
              {showGroups && userData.Role === "Trainer" && (
                <GroupsSection>
                  <GroupTitle>Ваши группы</GroupTitle>
                  {groupsLoading ? (
                    <div style={{ color: "#ffd700" }}>Загрузка...</div>
                  ) : groups.length === 0 ? (
                    <>
                      <div style={{ color: "#fffbe6", marginBottom: 10 }}>
                        У вас пока нет групп!
                      </div>
                      {!showCreateForm && (
                        <SmallButton onClick={() => setShowCreateForm(true)}>
                          Создать группу
                        </SmallButton>
                      )}
                      {showCreateForm && (
                        <CreateGroupForm onSubmit={handleCreateGroup}>
                          <SmallInput
                            type="text"
                            placeholder="Название группы"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                          />
                          <SmallInput
                            type="text"
                            placeholder="Описание (необязательно)"
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                          />
                          <SmallButton type="submit">Создать</SmallButton>
                          <SmallButton
                            type="button"
                            style={{
                              background: "#fff",
                              color: "#a0522d",
                              border: "1.5px solid #ffd700",
                            }}
                            onClick={() => setShowCreateForm(false)}
                          >
                            Отмена
                          </SmallButton>
                        </CreateGroupForm>
                      )}
                    </>
                  ) : (
                    <>
                      <GroupList>
                        {groups.map((g) => (
                          <GroupItem key={g.ID} style={{ position: "relative" }}>
                            <b>{g.Name}</b>
                            {g.Description && (
                              <div style={{ fontSize: "0.95em", color: "#ffd700" }}>{g.Description}</div>
                            )}
                            <div style={{ fontSize: "0.85em", color: "#fffbe6", marginTop: 2 }}>
                              Создана: {g.CreatedAt && new Date(g.CreatedAt).toLocaleDateString()}
                            </div>
                            <SmallButton style={{ marginTop: 8, background: "#2196f3", color: "#fff" }} onClick={() => handleOpenInviteForm(g.ID)}>
                              Пригласить
                            </SmallButton>
                            {inviteFormGroupId === g.ID && (
                              <InviteUserForm onSubmit={handleSendInvite}>
                                <div style={{position: "relative"}}>
                                  <SmallInput
                                    type="text"
                                    placeholder="Email или никнейм пользователя"
                                    value={inviteInput}
                                    onChange={handleInviteInputChange}
                                    autoFocus
                                    autoComplete="off"
                                  />
                                  {inviteInput.length >= 3 && inviteSuggestions.length > 0 && (
                                    <AutocompleteList>
                                      {inviteSuggestions.map((u) => (
                                        <AutocompleteItem key={u.ID} onClick={() => handleSelectInviteUser(u)}>
                                          {u.Nickname} {u.Email && <span style={{ color: "#a0522d", fontSize: "0.95em" }}>({u.Email})</span>}
                                        </AutocompleteItem>
                                      ))}
                                    </AutocompleteList>
                                  )}
                                  {inviteLoading && <div style={{ color: "#ffd700", fontSize: "0.95em" }}>Поиск...</div>}
                                  {inviteError && <div style={{ color: "#f44336", fontSize: "0.95em" }}>{inviteError}</div>}
                                </div>
                                <InviteButtonRow>
                                  <SmallButton type="submit" disabled={inviteLoading || !selectedInviteUser} style={{ background: "#4caf50", color: "#fff" }}>Отправить приглашение</SmallButton>
                                  <SmallButton type="button" style={{ background: "#fff", color: "#a0522d", border: "1.5px solid #ffd700" }} onClick={() => setInviteFormGroupId(null)}>Отмена</SmallButton>
                                </InviteButtonRow>
                              </InviteUserForm>
                            )}
                          </GroupItem>
                        ))}
                      </GroupList>
                      {!showCreateForm && (
                        <SmallButton onClick={() => setShowCreateForm(true)}>
                          Создать новую группу
                        </SmallButton>
                      )}
                      {showCreateForm && (
                        <CreateGroupForm onSubmit={handleCreateGroup}>
                          <SmallInput
                            type="text"
                            placeholder="Название группы"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                          />
                          <SmallInput
                            type="text"
                            placeholder="Описание (необязательно)"
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                          />
                          <SmallButton type="submit">Создать</SmallButton>
                          <SmallButton
                            type="button"
                            style={{
                              background: "#fff",
                              color: "#a0522d",
                              border: "1.5px solid #ffd700",
                            }}
                            onClick={() => setShowCreateForm(false)}
                          >
                            Отмена
                          </SmallButton>
                        </CreateGroupForm>
                      )}
                    </>
                  )}
                </GroupsSection>
              )}
              {/* Раздел приглашений в группы */}
              {invitesLoading ? (
                <InvitesSection>
                  <InviteTitle>Приглашения в группы</InviteTitle>
                  <div style={{ color: "#ffd700" }}>Загрузка...</div>
                </InvitesSection>
              ) : invites.length > 0 ? (
                <InvitesSection>
                  <InviteTitle>Приглашения в группы</InviteTitle>
                  <InviteList>
                    {invites.map((invite) => (
                      <InviteItem key={invite.GroupID}>
                        <b>{invite.GroupName}</b>
                        {invite.Description && (
                          <div style={{ fontSize: "0.95em", color: "#ffd700" }}>
                            {invite.Description}
                          </div>
                        )}
                        <div style={{ fontSize: "0.9em", color: "#fffbe6" }}>
                          Тренер: {invite.TrainerName}
                        </div>
                        <InviteButtonRow>
                          <SmallButton
                            onClick={() => handleAcceptInvite(invite.GroupID)}
                            style={{ background: "#4caf50", color: "#fff" }}
                          >
                            Принять
                          </SmallButton>
                          <SmallButton
                            onClick={() => handleDeclineInvite(invite.GroupID)}
                            style={{ background: "#f44336", color: "#fff" }}
                          >
                            Отклонить
                          </SmallButton>
                        </InviteButtonRow>
                      </InviteItem>
                    ))}
                  </InviteList>
                </InvitesSection>
              ) : null}
            </>
          )}
        </ProfileCard>
      </CardsGridContainer>
    </motion.div>
  );
};

export default Profile;
