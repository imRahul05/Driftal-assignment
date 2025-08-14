import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DashboardPage from './pages/DashboardPage';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: white;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(78, 205, 196, 0.6);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(78, 205, 196, 0.8);
  }

  /* Ensure proper text rendering */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    line-height: 1.5;
  }

  button {
    font-family: inherit;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: none;
  }

  button:focus,
  input:focus,
  select:focus {
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.5);
  }

  /* Print styles */
  @media print {
    body {
      background: white !important;
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
`;

const ErrorBoundary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  color: white;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 15px;
  color: #ff3b30;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
  max-width: 600px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

// Error boundary component
class ErrorBoundaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ConnexView Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundary>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>
            The ConnexView dashboard encountered an unexpected error. 
            Please try refreshing the page or contact support if the issue persists.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            🔄 Retry
          </RetryButton>
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundaryComponent>
      <GlobalStyle />
      <AppContainer>
        <DashboardPage />
      </AppContainer>
    </ErrorBoundaryComponent>
  );
}

export default App;
