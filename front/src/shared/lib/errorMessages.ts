// shared/lib/errorMessages.ts

export const errorMessagesMap: Record<string, string> = {
  'Internal server error': 'Внутренняя ошибка сервера. Попробуйте позже.',
  'Internal Server Error': 'Внутренняя ошибка сервера. Попробуйте позже.',

  'Invalid credentials': 'Неверный email или пароль',
  'Invalid email or password': 'Неверный email или пароль',
  'User not found': 'Пользователь не найден',
  'User already exists': 'Пользователь с таким email уже существует',
  'Email already registered': 'Этот email уже зарегистрирован',
  Unauthorized: 'Необходима авторизация',
  Forbidden: 'Доступ запрещён',

  'Validation failed': 'Ошибка валидации данных',
  'Invalid input': 'Некорректные данные',

  'Network Error': 'Ошибка сети. Проверьте подключение к интернету.',
  Timeout: 'Время ожидания истекло. Попробуйте снова.',
  'Service unavailable': 'Сервис временно недоступен',

  'Invalid token': 'Недействительный токен',
  'Token expired': 'Сессия истекла. Войдите снова.',
  'Refresh token expired': 'Сессия истекла. Войдите снова.',
};

export const getRussianErrorMessage = (
  englishMessage: string | undefined,
): string => {
  if (!englishMessage) return 'Произошла неизвестная ошибка';

  if (errorMessagesMap[englishMessage]) {
    return errorMessagesMap[englishMessage];
  }

  for (const [key, value] of Object.entries(errorMessagesMap)) {
    if (englishMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return englishMessage;
};
