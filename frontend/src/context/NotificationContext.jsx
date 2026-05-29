import React, { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const NotificationContext = createContext(null);

const TYPE_CLASS = {
  success: 'app-notification--success',
  error: 'app-notification--error',
  warning: 'app-notification--warning',
  info: 'app-notification--info',
};

const TYPE_ICONS = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const dismiss = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now();
    setNotification({ message, type, id });
    if (duration > 0) {
      setTimeout(() => {
        setNotification((current) => (current?.id === id ? null : current));
      }, duration);
    }
  }, []);

  const notify = {
    success: (message) => showNotification(message, 'success'),
    error: (message) => showNotification(message, 'error'),
    warning: (message) => showNotification(message, 'warning'),
    info: (message) => showNotification(message, 'info'),
  };

  const notificationBar = notification
    ? createPortal(
        <div className="app-notification-layer" role="alert" aria-live="polite">
          <div className={`app-notification ${TYPE_CLASS[notification.type]}`}>
            <div className="app-notification__inner">
              <span className="app-notification__icon" aria-hidden="true">
                {TYPE_ICONS[notification.type]}
              </span>
              <p className="app-notification__message">{notification.message}</p>
              <button
                type="button"
                onClick={dismiss}
                className="app-notification__close"
                aria-label="Dismiss notification"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {notificationBar}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
