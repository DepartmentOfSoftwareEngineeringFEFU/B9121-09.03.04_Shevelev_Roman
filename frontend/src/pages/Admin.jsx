import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";

const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Sidebar = styled.div`
  width: 210px;
  background: rgba(139, 69, 19, 0.98);
  box-shadow: 2px 0 12px rgba(0,0,0,0.08);
  padding: 36px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const AdminContainer = styled.div`
  flex: 1;
  margin: 0px auto 0;
  background: rgba(160, 82, 45, 0.95);
  border-radius: 0 16px 16px 0;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 36px 32px 32px 32px;
  color: #f5f5dc;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #a0522d 0%, #ffd700 100%);
`;

const AuthBox = styled.div`
  background: rgba(160, 82, 45, 0.98);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 40px 36px 32px 36px;
  min-width: 340px;
  color: #f5f5dc;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h2`
  color: #ffd700;
  text-align: center;
  margin-bottom: 28px;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

const TrainerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TrainerItem = styled.li`
  background: rgba(255, 255, 255, 0.10);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.10);
  margin-bottom: 18px;
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1.5px solid #ffd70033;
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
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.08);
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

const Input = styled.input`
  width: 95%;
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

const Message = styled.div`
  margin-top: 12px;
  padding: 10px;
  border-radius: 6px;
  background: ${({ success }) => (success ? "#4caf50" : "#f44336")};
  color: #fff;
  text-align: center;
  font-weight: 500;
`;

const SidebarItem = styled.button`
  background: ${({ active }) => (active ? "#ffd700" : "transparent")};
  color: ${({ active }) => (active ? "#8b4513" : "#f5f5dc")};
  border: none;
  border-radius: 0 20px 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 18px 24px 18px 32px;
  margin-bottom: 6px;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  outline: none;
  &:hover {
    background: #ffd700cc;
    color: #8b4513;
  }
`;

const TABS = [
  { key: "requests", label: "Заявки" },
  { key: "trainers", label: "Тренеры" },
  { key: "groups", label: "Группы" },
  { key: "users", label: "Пользователи" },
  { key: "stats", label: "Статистика" },
];

const Admin = () => {
  const [pending, setPending] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [auth, setAuth] = useState({ login: "", password: "" });
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("requests");

  const fetchPending = async (login, password) => {
    setLoading(true);
    try {
      const res = await fetch("/users/admin/pending-trainers", {
        headers: {
          Authorization: "Basic " + btoa(`${login}:${password}`),
        },
      });
      if (res.status === 401) {
        setIsAuth(false);
        setPending([]);
        return;
      }
      const data = await res.json();
      setPending(data);
      setIsAuth(true);
    } catch {
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async (login, password) => {
    setLoading(true);
    try {
      const res = await fetch("/users/admin/trainers", {
        headers: {
          Authorization: "Basic " + btoa(`${login}:${password}`),
        },
      });
      if (res.status === 401) {
        setIsAuth(false);
        setTrainers([]);
        return;
      }
      const data = await res.json();
      setTrainers(data);
      setIsAuth(true);
    } catch {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth && tab === "requests") fetchPending(auth.login, auth.password);
    if (isAuth && tab === "trainers") fetchTrainers(auth.login, auth.password);
    // eslint-disable-next-line
  }, [isAuth, tab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await fetchPending(auth.login, auth.password);
  };

  const handleAction = async (userId, action) => {
    const actionText = action === "approve" ? "Одобрить" : "Отклонить";
    const confirm = await Swal.fire({
      title: `${actionText} заявку?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Отмена",
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await fetch(`/users/admin/${action}-trainer/${userId}`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${auth.login}:${auth.password}`),
        },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Успешно", text: data.message });
        fetchPending(auth.login, auth.password);
      } else {
        Swal.fire({ icon: "error", title: "Ошибка", text: data.message });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Ошибка", text: "Ошибка сети" });
    }
  };

  const handleRevokeTrainer = async (userId) => {
    const confirm = await Swal.fire({
      title: "Отозвать права тренера?",
      text: "Все группы и участники этих групп будут удалены!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Отозвать права",
      cancelButtonText: "Отмена",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/users/admin/revoke-trainer/${userId}`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${auth.login}:${auth.password}`),
        },
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Права отозваны", text: data.message });
        setTrainers(trainers.filter(t => t.ID !== userId));
      } else {
        Swal.fire({ icon: "error", title: "Ошибка", text: data.message });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Ошибка", text: "Ошибка сети" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <AuthWrapper>
        <AuthBox>
          <Title>Вход в панель администратора</Title>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Input
              type="text"
              placeholder="Логин"
              value={auth.login}
              onChange={e => setAuth(a => ({ ...a, login: e.target.value }))}
              required
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={auth.password}
              onChange={e => setAuth(a => ({ ...a, password: e.target.value }))}
              required
            />
            <Button type="submit" disabled={loading}>Войти</Button>
          </form>
        </AuthBox>
      </AuthWrapper>
    );
  }

  return (
    <AdminLayout>
      <Sidebar>
        {TABS.map((t) => (
          <SidebarItem
            key={t.key}
            active={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </SidebarItem>
        ))}
      </Sidebar>
      <AdminContainer>
        {tab === "requests" && (
          <>
            <Title>Заявки на роль тренера</Title>
            {pending.length === 0 ? (
              <Message success={false} style={{ background: "#ffa726", color: "#fff" }}>
                Нет заявок на рассмотрение
              </Message>
            ) : (
              <TrainerList>
                {pending.map((u) => (
                  <TrainerItem key={u.ID}>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}><b>Никнейм:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{u.Nickname}</span></div>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}><b>Email:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{u.Email}</span></div>
                    <ButtonRow>
                      <Button onClick={() => handleAction(u.ID, "approve")}>Одобрить</Button>
                      <Button onClick={() => handleAction(u.ID, "reject")}>Отклонить</Button>
                    </ButtonRow>
                  </TrainerItem>
                ))}
              </TrainerList>
            )}
          </>
        )}
        {tab === "trainers" && (
          <>
            <Title>Тренеры</Title>
            {trainers.length === 0 ? (
              <Message success={false} style={{ background: "#ffa726", color: "#fff" }}>
                Нет тренеров
              </Message>
            ) : (
              <TrainerList>
                {trainers.map((u) => (
                  <TrainerItem key={u.ID}>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}><b>Никнейм:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{u.Nickname}</span></div>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}><b>Email:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{u.Email}</span></div>
                    <ButtonRow>
                      <Button onClick={() => handleRevokeTrainer(u.ID)} style={{ background: '#f44336', color: '#fff' }}>Отозвать права</Button>
                    </ButtonRow>
                  </TrainerItem>
                ))}
              </TrainerList>
            )}
          </>
        )}
        {tab === "groups" && (
          <Title>Группы (заглушка)</Title>
        )}
        {tab === "users" && (
          <Title>Пользователи (заглушка)</Title>
        )}
        {tab === "stats" && (
          <Title>Статистика (заглушка)</Title>
        )}
      </AdminContainer>
    </AdminLayout>
  );
};

export default Admin;
