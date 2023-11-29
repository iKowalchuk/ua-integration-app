import constate from 'constate';
import { useEffect, useState } from 'react';

import login from '@/api/login';
import logout from '@/api/logout';
import { PROJECT_ID_KEY, SESSIONS_KEY } from '@/constants/App';
import * as storage from '@/utils/storage';

type ApiURL = string;
type ProjectId = number;
type Token = string;

type Session = {
  apiURL: ApiURL;
  projectId: ProjectId;
  token: Token;
};

type AuthState =
  | { type: 'initial' }
  | { type: 'authenticated'; session: Session }
  | { type: 'unauthenticated' };

type LoginPayload = {
  apiURL: ApiURL;
  projectId: ProjectId;
  login: string;
  password: string;
};

interface AuthContextProps {
  authState: AuthState;
  sessions: Session[];
  onLogin: (payload: LoginPayload) => Promise<void>;
  onLogout: () => Promise<void>;
  onSessionChange: (projectId: ProjectId) => void;
}

const useAuth = (): AuthContextProps => {
  const [authState, setAuthState] = useState<AuthState>({ type: 'initial' });
  const [sessions, setSessions] = useState<Session[]>([]);

  const onLogin = async (payload: LoginPayload) => {
    try {
      const { token } = await login({
        apiURL: payload.apiURL,
        login: payload.login,
        password: payload.password,
      });

      const session = {
        apiURL: payload.apiURL,
        projectId: payload.projectId,
        token,
      };

      setAuthState({
        type: 'authenticated',
        session,
      });
      await storage.saveString(PROJECT_ID_KEY, payload.projectId.toString());

      const isExistsSession = sessions.some(
        (session) => session.token === token
      );
      if (isExistsSession) {
        setSessions((prevSessions) => {
          const newSessions = prevSessions.map((existsSession) =>
            existsSession.token === token ? session : existsSession
          );

          storage.save(SESSIONS_KEY, newSessions);

          return newSessions;
        });
      } else {
        setSessions((prevSessions) => {
          const newSessions = [...prevSessions, session];

          storage.save(SESSIONS_KEY, newSessions);

          return newSessions;
        });
      }
    } catch {
      setAuthState({ type: 'unauthenticated' });
    }
  };

  const onLogout = async () => {
    if (authState.type !== 'authenticated') {
      return;
    }

    try {
      await logout({
        apiURL: authState.session.apiURL,
        token: authState.session.token,
      });
    } finally {
      setSessions((prevSessions) => {
        const newSessions = prevSessions.filter(
          (session) => session.token !== authState.session.token
        );

        storage.save(SESSIONS_KEY, newSessions);

        return newSessions;
      });

      setAuthState({ type: 'unauthenticated' });
      await storage.remove(PROJECT_ID_KEY);
    }
  };

  const onSessionChange = async (projectId: ProjectId) => {
    const session = sessions.find((session) => session.projectId === projectId);
    if (session) {
      setAuthState({
        type: 'authenticated',
        session,
      });
      await storage.saveString(PROJECT_ID_KEY, projectId.toString());
    } else {
      setAuthState({ type: 'unauthenticated' });
    }
  };

  useEffect(() => {
    const loadAuthState = async () => {
      const projectId = await storage.loadString(PROJECT_ID_KEY);
      const sessions = (await storage.load<Session[]>(SESSIONS_KEY)) || [];

      if (projectId) {
        const activeSession = sessions.find(
          (session) => session.projectId === Number(projectId)
        );
        if (activeSession) {
          setAuthState({
            type: 'authenticated',
            session: activeSession,
          });
        } else {
          setAuthState({ type: 'unauthenticated' });
        }
      } else {
        setAuthState({ type: 'unauthenticated' });
      }

      setSessions(sessions);
    };

    loadAuthState();
  }, []);

  return { authState, sessions, onLogin, onLogout, onSessionChange };
};

export const [AuthProvider, useAuthContext] = constate(useAuth);
