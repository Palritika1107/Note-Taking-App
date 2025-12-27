import ContextProvider from "./ContextProvider";
import { KeyboardProvider } from "./KeyboardContext";

export default function AppProviders({ children }) {
  return (
    <ContextProvider>
      <KeyboardProvider>
        {children}
      </KeyboardProvider>
    </ContextProvider>
  );
}