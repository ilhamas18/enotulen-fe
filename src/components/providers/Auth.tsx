import React, { Dispatch, SetStateAction } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  setAuthenticated: () => {}
})

interface AuthType {
  children: any;
  authenticated: boolean
}

export function AuthProvider({ children, authenticated }: AuthType) {
  const [isAuthenticated, setAuthenticated] = React.useState<boolean>(false); 
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    setAuthenticated(authenticated);
    setIsLoading(false);
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
}

export function useIsAuthenticated() {
  const context = useAuth();
  return context.isAuthenticated;
}