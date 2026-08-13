export const SEVERITY_CONFIG = {
  CRITICAL: { label: 'Kritikal', color: '#DC2826', dotClass: 'ux-bg-red', badgeClass: 'ux-b-crit' },
  MAJOR:    { label: 'Mayor',    color: '#EAB308', dotClass: 'ux-bg-yellow', badgeClass: 'ux-b-may' },
  MINOR:    { label: 'Minor',    color: '#84CC16', dotClass: 'ux-bg-lime', badgeClass: 'ux-b-min' },
  PASSED:   { label: 'Passed',   color: '#15803D', dotClass: 'ux-bg-green', badgeClass: 'ux-b-pass' }
} as const;

export type SeverityLevel = keyof typeof SEVERITY_CONFIG;