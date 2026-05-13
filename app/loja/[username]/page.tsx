import { notFound } from "next/navigation";
import { CarCard, GlobalNavigation, StatCard } from "../../components";
import { cars, getCarsByShop, shops } from "../../data";

type Props = {
  params: Promise<{ username: string }>;
};

export function generateStaticParams() {
  return shops.map((shop) => ({ username: shop.username }));
}

export default async function StorePage({ params }: Props) {
  const { username } = await params;
  const shop = shops.find((item) => item.username === username && item.isActive);

  if (!shop) {
    notFound();
  }

  const stock = getCarsByShop(shop.id).filter((car) => !car.isRepasse);
  const leads = cars.filter((car) => car.shopId === shop.id).reduce((total, car) => total + car.leads, 0);

  return (
    <>
      <GlobalNavigation />
      <main className="bg-slate-100">
        <section className="bg-white">
          <div className="relative h-72 overflow-hidden md:h-96">
            <img src={shop.cover} alt={shop.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end">
              <img src={shop.avatar} alt={shop.name} className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl" />
              <div className="relative rounded-lg bg-white p-4 shadow-sm md:flex-1">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-black text-slate-950">{shop.name}</h1>
                      {shop.isVerified && <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">Loja verificada</span>}
                    </div>
                    <p className="mt-1 font-semibold text-slate-500">{shop.city} - @{shop.username}</p>
                  </div>
                  <a href={`https://wa.me/${shop.whatsapp}`} className="rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-black text-white">
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatCard label="Veiculos em estoque" value={`${stock.length}`} />
              <StatCard label="Visualizacoes" value={`${shop.views}`} tone="dark" />
              <StatCard label="Interesses gerados" value={`${leads}`} tone="green" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-950">Estoque exclusivo</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stock.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </section>
      </main>
    </>
  );
}
