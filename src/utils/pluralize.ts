export const pluralize = (text?: string, count?: number) =>
  text ? `${text}${count && count > 1 ? 's' : ''}` : '';
