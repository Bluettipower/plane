import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// serverSideTranslations see
// https://github.com/i18next/next-i18next?tab=readme-ov-file#serversidetranslations
// https://react.i18next.com/latest/ssr

const getLocaleProps = (namespaces: string[]): GetStaticProps => async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, namespaces))
  }
});

export default getLocaleProps;
export const getStaticProps = getLocaleProps(['common']);
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const LableToKey = (label: string): string => {
  return label.toLowerCase().replace(/ /g, "_");
}