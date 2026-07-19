import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('bg-red-500', 'text-white', 'bg-blue-500');
    // bg-blue-500 should override bg-red-500 in tailwind-merge
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-red-500');
    expect(result).toContain('text-white');
  });

  it('handles conditional class names correctly', () => {
    const active = true;
    const disabled = false;
    const result = cn(
      'px-4 py-2',
      active && 'text-green-500',
      disabled && 'opacity-50'
    );
    expect(result).toContain('px-4 py-2');
    expect(result).toContain('text-green-500');
    expect(result).not.toContain('opacity-50');
  });

  it('handles undefined or null class names gracefully', () => {
    const result = cn('px-4', undefined, null, 'py-2');
    expect(result).toBe('px-4 py-2');
  });
});
