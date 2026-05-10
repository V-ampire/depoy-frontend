export const WELCOME_TEXT = 'Приветствую. Я помогу тебе найти ответы.\nЕсли будет желание, оцени мой ответ — так я становлюсь лучше для тебя.'

export const DEBUG = import.meta.env.VITE_DEBUG === 'true'

export const API_URL = import.meta.env.VITE_API_URL || ''

// Временная заглушка для Android: показывает initData и URL вместо приложения. Убрать когда исправим.
export const ANDROID_STUB = true
