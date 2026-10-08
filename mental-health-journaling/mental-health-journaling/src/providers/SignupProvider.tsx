import { createContext, useContext, useState } from "react";

type SignupData = {
  email: string;
  password: string;
  nombre: string;
};

type SignupContextType = {
  data: SignupData;
  updateData: (values: Partial<SignupData>) => void;
  reset: () => void;
};

const initialData: SignupData = {
  email: "",
  password: "",
  nombre: "",
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export default function SignupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SignupData>(initialData);

  const updateData = (values: Partial<SignupData>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  const reset = () => setData(initialData);

  return (
    <SignupContext.Provider value={{ data, updateData, reset }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup debe usarse dentro de SignupProvider");
  }
  return context;
}