import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const getLocaleProps =
  (namespaces: string[]): GetStaticProps =>
    async ({ locale }) => ({
      props: {
        ...(await serverSideTranslations(locale!, namespaces)),
      },
    });

export default getLocaleProps;

export const getStaticProps = getLocaleProps(['common']);

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});