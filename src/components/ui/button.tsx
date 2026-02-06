import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn('rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur', className)}
    {...props}
  />
);
