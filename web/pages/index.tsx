import { ReactElement } from "react";
// layouts
import { SignInView } from "@/components/page-views";
import DefaultLayout from "@/layouts/default-layout";
// components
// type
import { NextPageWithLayout } from "@/lib/types";
export {getStaticProps,} from "@/lib/i18next"

const HomePage: NextPageWithLayout = () => <SignInView />;

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default HomePage;
