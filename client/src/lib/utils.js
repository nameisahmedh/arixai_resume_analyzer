import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS class names with conflict resolution
 * 
 * Combines clsx for conditional class logic with twMerge to handle
 * Tailwind CSS conflicts (e.g., when both 'w-4' and 'w-8' are present,
 * the last one wins rather than creating duplicate width classes)
 * 
 * @param {...any} inputs - Class names, objects, or arrays of class names
 * @returns {string} Merged and resolved class name string
 * 
 * @example
 * // Basic usage
 * cn('px-2', 'py-1')  // 'px-2 py-1'
 * 
 * // With conditional classes
 * cn('px-2', isActive && 'bg-blue-500')  // 'px-2 bg-blue-500' or 'px-2'
 * 
 * // With conflict resolution
 * cn('w-4', 'w-8')  // 'w-8' (not both)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
