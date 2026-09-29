import { useEffect } from 'react';
import ChatPage from './pages/ChatPage';
import { useStoredState } from './hooks/useStoredState';

export default function App() {
  const [theme, setTheme] = useStoredState<'light' | 'dark'>(
    'echogpt-theme',
    'light',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <ChatPage
      theme={theme}
      onToggleTheme={() =>
        setTheme((value) => (value === 'light' ? 'dark' : 'light'))
      }
    />
  );
}
