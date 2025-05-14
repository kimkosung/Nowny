import React, {createContext, useState, useContext, useEffect} from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 로딩 상태를 시뮬레이션합니다
    const checkAuth = async () => {
      // 여기서는 간단히 비로그인 상태로 초기화하고 로딩을 종료합니다
      setIsAuthenticated(false);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 로그인 시뮬레이션: "test"/"1234"일 경우에만 로그인 성공
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === 'test' && password === '1234') {
          setIsAuthenticated(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 2000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
