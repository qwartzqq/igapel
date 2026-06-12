import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertBadge } from './ui/alert-badge';
import { RiCheckLine, RiErrorWarningLine, RiSendPlaneLine } from '@remixicon/react';

type NotifyVariant = 'error' | 'success' | 'info';

interface NotifyOptions {
  variant: NotifyVariant;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  durationMs?: number;
}

interface Toast extends NotifyOptions {
  id: number;
}

const NotificationContext = React.createContext<(opts: NotifyOptions) => void>(() => {});

const DEFAULT_ICONS: Record<NotifyVariant, React.ComponentType<{ className?: string }>> = {
  error: RiErrorWarningLine,
  success: RiCheckLine,
  info: RiSendPlaneLine,
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);

  const notify = React.useCallback((opts: NotifyOptions) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { ...opts, id }]);
    const duration = opts.durationMs ?? 3500;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <AlertBadge
                variant={toast.variant}
                label={toast.label}
                icon={toast.icon || DEFAULT_ICONS[toast.variant]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => React.useContext(NotificationContext);
