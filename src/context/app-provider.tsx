import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AppContextValue {
  cartSummaryRequest: number;
  showCartSummary: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider(props: { children: ReactNode }): React.JSX.Element {
  const [cartSummaryRequest, setCartSummaryRequest] = useState(0);
  const showCartSummary = useCallback(() => {
    setCartSummaryRequest(request => request + 1);
  }, []);
  const value = useMemo(
    () => ({ cartSummaryRequest, showCartSummary }),
    [cartSummaryRequest, showCartSummary],
  );
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useOptionalApp(): AppContextValue | undefined {
  return useContext(AppContext);
}
