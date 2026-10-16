import React from 'react'

export default function ZodiacIcon({ id, className = 'w-6 h-6' }) {
  switch (id) {
    case 'aries':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V8" />
          <path d="M12 8C12 5 9.5 3 7 3C4.5 3 3 5 3 7.5C3 9.5 4.5 11 6.5 11" />
          <path d="M12 8C12 5 14.5 3 17 3C19.5 3 21 5 21 7.5C21 9.5 19.5 11 17.5 11" />
        </svg>
      )
    case 'taurus':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="15" r="5" />
          <path d="M5 5C5 8.5 8 10 12 10C16 10 19 8.5 19 5" />
        </svg>
      )
    case 'gemini':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4C9.5 6 14.5 6 19 4" />
          <path d="M5 20C9.5 18 14.5 18 19 20" />
          <path d="M9 5.5V18.5" />
          <path d="M15 5.5V18.5" />
        </svg>
      )
    case 'cancer':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="9" r="3" />
          <path d="M7 6C12 6 17 7.5 19 11" />
          <circle cx="17" cy="15" r="3" />
          <path d="M17 18C12 18 7 16.5 5 13" />
        </svg>
      )
    case 'leo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="14" r="3" />
          <path d="M9.5 12C10.5 7 13 4 16 4C18.5 4 20 6 19 9C18 12 15 14 15 17C15 19 16.5 20 18.5 19.5" />
        </svg>
      )
    case 'virgo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6V17" />
          <path d="M4 9C4 6.5 6 5 7.5 5C9 5 9.5 6.5 9.5 9V17" />
          <path d="M9.5 9C9.5 6.5 11.5 5 13 5C14.5 5 15 6.5 15 9V17C15 19 16.5 20 18.5 19" />
          <path d="M15 13C17.5 13 19.5 11 19.5 8.5C19.5 6.5 18 5.5 16.5 6.5L13 19" />
        </svg>
      )
    case 'libra':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18H20" />
          <path d="M4 14H8.5C7.5 12.5 7.5 10 9 8.5C10.5 7 13.5 7 15 8.5C16.5 10 16.5 12.5 15.5 14H20" />
        </svg>
      )
    case 'scorpio':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6V16" />
          <path d="M4 9C4 6.5 6 5 7.5 5C9 5 9.5 6.5 9.5 9V16" />
          <path d="M9.5 9C9.5 6.5 11.5 5 13 5C14.5 5 15 6.5 15 9V16C15 18 17 18.5 19.5 16" />
          <path d="M18 14L20.5 15.5L19 18" />
        </svg>
      )
    case 'sagittarius':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19L19 5" />
          <path d="M12 5H19V12" />
          <path d="M8 11L13 16" />
        </svg>
      )
    case 'capricorn':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7L9 17L13 9C14 7 16.5 7 17.5 9.5C18.5 12 17 16 14.5 17.5" />
          <circle cx="17" cy="16" r="2.5" />
        </svg>
      )
    case 'aquarius':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10L6 7L9 10L12 7L15 10L18 7L21 10" />
          <path d="M3 16L6 13L9 16L12 13L15 16L18 13L21 16" />
        </svg>
      )
    case 'pisces':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4C9.5 8 9.5 16 6 20" />
          <path d="M18 4C14.5 8 14.5 16 18 20" />
          <path d="M4 12H20" />
        </svg>
      )
  }
}
