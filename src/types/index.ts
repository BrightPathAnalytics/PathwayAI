/**
 * User role type
 */
export type UserRole = "teacher" | "administrator" | "student" 

/**
 * Chart configuration interface
 */
export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
} 