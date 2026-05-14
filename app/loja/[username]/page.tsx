import { GlobalNavigation } from "../../components";
import { shops } from "../../data";
import { StorefrontClient } from "../../storefront-client";

type Props = {
  params: Promise<{ username: string }>;
};

export function generateStaticParams() {
  return shops.map((shop) => ({ username: shop.username }));
}

export default async function StorePage({ params }: Props) {
  const { username } = await params;

  return (
    <>
      <GlobalNavigation />
      <StorefrontClient username={username} />
    </>
  );
}
