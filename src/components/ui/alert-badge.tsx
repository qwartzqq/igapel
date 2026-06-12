import React from 'react';
import { cn } from '../../types';
import { RiArrowRightUpLine } from '@remixicon/react';

type AlertBadgeVariant = 'error' | 'success' | 'info';

interface AlertBadgeAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AlertBadgeProps {
  variant: AlertBadgeVariant;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: AlertBadgeAction;
  className?: string;
}

const VARIANT_STYLES: Record<AlertBadgeVariant, string> = {
  error: 'bg-rose-600 border-rose-800 text-white',
  success: 'bg-emerald-600 border-emerald-800 text-white',
  info: 'bg-[#3393e0] border-[#1f6fb5] text-white',
};

export const AlertBadge: React.FC<AlertBadgeProps> = ({ variant, label, icon: Icon, action, className }) => {
  const ActionIcon = action?.icon || RiArrowRightUpLine;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border-[1.5px] pl-3 pr-1.5 py-1.5 text-sm font-medium shadow-2xl',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="truncate">{label}</span>
      {action && (
        action.href ? (
          <a
            href={action.href}
            onClick={action.onClick}
            className="flex items-center gap-1 rounded-md bg-black/15 hover:bg-black/25 px-2.5 py-1 text-xs font-bold text-white transition-colors flex-shrink-0"
          >
            {action.label}
            {ActionIcon && <ActionIcon className="w-3 h-3" />}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1 rounded-md bg-black/15 hover:bg-black/25 px-2.5 py-1 text-xs font-bold text-white transition-colors flex-shrink-0"
          >
            {action.label}
            {ActionIcon && <ActionIcon className="w-3 h-3" />}
          </button>
        )
      )}
    </div>
  );
};
