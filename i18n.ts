import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  try {
    const messages = (await import(`@/public/messages/${locale}.json`)).default;
    return {
      messages,
      dynamic: 'auto'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    throw new Error('Failed to load messages');
  }
});
