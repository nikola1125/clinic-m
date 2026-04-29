import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['sq', 'en', 'it'],
  defaultLocale: 'sq',
  localePrefix: 'never',
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
