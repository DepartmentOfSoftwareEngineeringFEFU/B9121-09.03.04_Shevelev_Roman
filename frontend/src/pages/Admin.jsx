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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #fffbe6;
  opacity: 0.9;
`;

const UserItem = styled.li`
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

const GroupItem = styled.li`
  background: rgba(255, 255, 255, 0.10);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.10);
  margin-bottom: 18px;
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #ffd70033;
`;

const RoleBadge = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'Trainer': return 'rgba(76, 175, 80, 0.2)';
      case 'PendingTrainer': return 'rgba(255, 167, 38, 0.2)';
      default: return 'rgba(33, 150, 243, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'Trainer': return '#4caf50';
      case 'PendingTrainer': return '#ffa726';
      default: return '#2196f3';
    }
  }};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${props => {
    switch (props.role) {
      case 'Trainer': return 'rgba(76, 175, 80, 0.3)';
      case 'PendingTrainer': return 'rgba(255, 167, 38, 0.3)';
      default: return 'rgba(33, 150, 243, 0.3)';
    }
  }};
  align-self: flex-start;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GroupList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DailyActivityChart = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
`;

const ChartTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 15px;
  text-align: center;
`;

const ChartBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const ChartDate = styled.div`
  width: 80px;
  font-size: 0.9rem;
  color: #fffbe6;
`;

const ChartBarContainer = styled.div`
  flex: 1;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const ChartBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  border-radius: 10px;
  width: ${props => props.percentage}%;
`;

const ChartValue = styled.div`
  width: 60px;
  font-size: 0.9rem;
  color: #ffd700;
  text-align: right;
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
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
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

  const fetchGroups = async (login, password) => {
    setLoading(true);
    try {
      const res = await fetch("/users/admin/groups", {
        headers: {
          Authorization: "Basic " + btoa(`${login}:${password}`),
        },
      });
      if (res.status === 401) {
        setIsAuth(false);
        setGroups([]);
        return;
      }
      const data = await res.json();
      setGroups(data);
      setIsAuth(true);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (login, password) => {
    setLoading(true);
    try {
      const res = await fetch("/users/admin/users", {
        headers: {
          Authorization: "Basic " + btoa(`${login}:${password}`),
        },
      });
      if (res.status === 401) {
        setIsAuth(false);
        setUsers([]);
        return;
      }
      const data = await res.json();
      setUsers(data);
      setIsAuth(true);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (login, password) => {
    setLoading(true);
    try {
      const res = await fetch("/users/admin/stats", {
        headers: {
          Authorization: "Basic " + btoa(`${login}:${password}`),
        },
      });
      if (res.status === 401) {
        setIsAuth(false);
        setStats(null);
        return;
      }
      const data = await res.json();
      setStats(data);
      setIsAuth(true);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth && tab === "requests") fetchPending(auth.login, auth.password);
    if (isAuth && tab === "trainers") fetchTrainers(auth.login, auth.password);
    if (isAuth && tab === "groups") fetchGroups(auth.login, auth.password);
    if (isAuth && tab === "users") fetchUsers(auth.login, auth.password);
    if (isAuth && tab === "stats") fetchStats(auth.login, auth.password);
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
          <>
            <Title>Группы</Title>
            {groups.length === 0 ? (
              <Message success={false} style={{ background: "#ffa726", color: "#fff" }}>
                Нет групп
              </Message>
            ) : (
              <GroupList>
                {groups.map((group) => (
                  <GroupItem key={group.ID}>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}>
                      <b>Название:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{group.Name}</span>
                    </div>
                    {group.Description && (
                      <div style={{ color: "#ffd700", fontWeight: 600 }}>
                        <b>Описание:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{group.Description}</span>
                      </div>
                    )}
                    <div style={{ color: "#ffd700", fontWeight: 600 }}>
                      <b>Тренер:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{group.TrainerName} ({group.TrainerEmail})</span>
                    </div>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}>
                      <b>Участников:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{group.MembersCount}</span>
                    </div>
                    <div style={{ color: "#ffd700", fontWeight: 600 }}>
                      <b>Создана:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>
                        {new Date(group.CreatedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </GroupItem>
                ))}
              </GroupList>
            )}
          </>
        )}
        {tab === "users" && (
          <>
            <Title>Пользователи</Title>
            {users.length === 0 ? (
              <Message success={false} style={{ background: "#ffa726", color: "#fff" }}>
                Нет пользователей
              </Message>
            ) : (
              <UserList>
                {users.map((user) => (
                  <UserItem key={user.ID}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Никнейм:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.Nickname}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Email:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.Email}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Рейтинг:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.Rating}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Игр сыграно:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.GamesPlayed}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Побед/Поражений/Ничьих:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>
                            {user.Wins}/{user.Losses}/{user.Draws}
                          </span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Групп:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.GroupsCount}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Решено задач:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.CompletedProblems}</span>
                        </div>
                        <div style={{ color: "#ffd700", fontWeight: 600 }}>
                          <b>Изучено уроков:</b> <span style={{ color: "#fffbe6", fontWeight: 400 }}>{user.CompletedLessons}</span>
                        </div>
                      </div>
                      <RoleBadge role={user.Role}>
                        {user.Role === 'Trainer' ? 'Тренер' : 
                         user.Role === 'PendingTrainer' ? 'Ожидает одобрения' : 'Пользователь'}
                      </RoleBadge>
                    </div>
                  </UserItem>
                ))}
              </UserList>
            )}
          </>
        )}
        {tab === "stats" && (
          <>
            <Title>Статистика</Title>
            {stats ? (
              <>
                <StatsGrid>
                  <StatCard>
                    <StatValue>{stats.users.TotalUsers}</StatValue>
                    <StatLabel>Всего пользователей</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.users.RegularUsers}</StatValue>
                    <StatLabel>Обычных пользователей</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.users.Trainers}</StatValue>
                    <StatLabel>Тренеров</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.users.PendingTrainers}</StatValue>
                    <StatLabel>Ожидают одобрения</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{Math.round(stats.users.AvgRating)}</StatValue>
                    <StatLabel>Средний рейтинг</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.users.TotalGames}</StatValue>
                    <StatLabel>Всего игр сыграно</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.groups.TotalGroups}</StatValue>
                    <StatLabel>Всего групп</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.groups.ActiveTrainers}</StatValue>
                    <StatLabel>Активных тренеров</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.problems.TotalProblems}</StatValue>
                    <StatLabel>Всего задач</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.problems.CompletedProblems}</StatValue>
                    <StatLabel>Решено задач</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.lessons.TotalLessons}</StatValue>
                    <StatLabel>Всего уроков</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{stats.lessons.CompletedLessons}</StatValue>
                    <StatLabel>Изучено уроков</StatLabel>
                  </StatCard>
                </StatsGrid>

                {stats.dailyActivity && stats.dailyActivity.length > 0 && (
                  <DailyActivityChart>
                    <ChartTitle>Активность за последние 7 дней</ChartTitle>
                    {stats.dailyActivity.map((day) => {
                      const maxGames = Math.max(...stats.dailyActivity.map(d => d.GamesPlayed));
                      const percentage = maxGames > 0 ? (day.GamesPlayed / maxGames) * 100 : 0;
                      
                      return (
                        <ChartBar key={day.Date}>
                          <ChartDate>{new Date(day.Date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}</ChartDate>
                          <ChartBarContainer>
                            <ChartBarFill percentage={percentage} />
                          </ChartBarContainer>
                          <ChartValue>{day.GamesPlayed} игр</ChartValue>
                        </ChartBar>
                      );
                    })}
                  </DailyActivityChart>
                )}
              </>
            ) : (
              <Message success={false} style={{ background: "#ffa726", color: "#fff" }}>
                Загрузка статистики...
              </Message>
            )}
          </>
        )}
      </AdminContainer>
    </AdminLayout>
  );
};

export default Admin;
