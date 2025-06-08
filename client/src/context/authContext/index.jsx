import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticated: false,
    user: null,
    isLoading: true,
  });

  // to update the state safely
  function updateState(updates) {
    setAuth((prev) => ({ ...prev, ...updates }));
  }

  async function handleRegisterUser() {
    const data = await registerService(signUpFormData);
    if (data?.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      updateState({
        authenticated: true,
        user: data.data.user,
        isLoading: false,
      });
    } else {
      updateState({
        authenticated: false,
        user: null,
        isLoading: false,
      });
    }

    return data;
  }
  async function handleLogin() {
    const data = await loginService(signInFormData);

    if (data?.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      updateState({
        authenticated: true,
        user: data.data.user,
        isLoading: false,
      });
    } else {
      updateState({
        authenticated: false,
        user: null,
        isLoading: false,
      });
    }

    return data;
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        updateState({
          authenticated: true,
          user: data.data.user,
          isLoading: false,
        });
      } else {
        updateState({
          authenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        updateState({
          authenticated: false,
          user: null,
          isLoading: false,
        });
      }
    }
  }

  function resetCredentials(){
    updateState({
      authenticated: false,
      user: null,
      isLoading: false,
    });
    sessionStorage.removeItem("accessToken")
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLogin,
        auth,
        resetCredentials,
      }}
    >
      {auth.isLoading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
