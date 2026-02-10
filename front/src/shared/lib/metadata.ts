import { type Metadata } from 'next';
import { isNil, omitBy } from 'lodash';
import { z } from 'zod';
import { DEFAULT_TITLE } from '../const/metadata';

/*import { SITE_URL } from 'shared/config/env';*/ //TODO добавить при появлении

export const imageSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  blurHash: z.string().optional(),
  url: z.string(),
  alt: z.string().optional(),
});

export const pageMetadataSchema = z.object({
  image: imageSchema.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const getMetadata = async ({
  title: _title,
  description: _description,
  image: images,
  url,
  noIndex = false,
}: {
  url: string;
  noIndex?: boolean;
} & z.infer<typeof pageMetadataSchema>) => {
  const title = _title ? `${_title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const description = _description || 'Описание'; //TODO добавить при появлении
  const applicationName = DEFAULT_TITLE;

  return omitBy<Metadata>(
    {
      /*  metadataBase: new URL(SITE_URL),*/ //TODO добавить про появлении
      title,
      applicationName,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        siteName: title,
        url,
        description,
        images,
        locale: 'ru_RU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      },
      icons: {
        icon: [
          { url: '/static/icons/favicon.ico', sizes: '256x256' },
          { url: '/static/icons/icon.svg', type: 'image/svg+xml' },
        ],
        apple: {
          url: '/static/icons/android-chrome-192x192.png',
          sizes: '180x180',
          type: 'image/png',
        },
      },
      manifest: '/static/icons/site.webmanifest',
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        },
      }),
    },
    isNil,
  );
};
