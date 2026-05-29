import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { loaderRef } from '../utils/loaderRef';

const LoaderContext = createContext(null);

const DEFAULT_MESSAGE = 'Please wait...';

const LoaderOverlay = ({ message }) => (
  <div className="app-loader-layer" role="status" aria-live="polite" aria-busy="true">
    <div className="app-loader-backdrop" aria-hidden="true" />
    <div className="app-loader-card">
      <div className="app-loader-spinner" aria-hidden="true">
        <span className="app-loader-spinner__ring" />
        <span className="app-loader-spinner__core" />
      </div>
      <p className="app-loader-message">{message}</p>
    </div>
  </div>
);

export const LoaderProvider = ({ children }) => {
  const [state, setState] = useState({ active: false, message: DEFAULT_MESSAGE });
  const countRef = useRef(0);

  const showLoader = useCallback((message = DEFAULT_MESSAGE) => {
    countRef.current += 1;
    setState({ active: true, message });
  }, []);

  const hideLoader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    if (countRef.current === 0) {
      setState((prev) => ({ ...prev, active: false }));
    }
  }, []);

  const runWithLoader = useCallback(async (asyncFn, message = DEFAULT_MESSAGE) => {
    showLoader(message);
    try {
      return await asyncFn();
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  useEffect(() => {
    loaderRef.current = { show: showLoader, hide: hideLoader };
    return () => {
      loaderRef.current = null;
    };
  }, [showLoader, hideLoader]);

  const overlay = state.active
    ? createPortal(<LoaderOverlay message={state.message} />, document.body)
    : null;

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, runWithLoader }}>
      {overlay}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};

export default LoaderProvider;
