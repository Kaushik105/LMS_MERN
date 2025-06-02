import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { createContext, useContext, useState } from "react";

export const authContext = createContext({});

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  return (
    <authContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
