import Link from "next/link";
import { GlobalNavigation, ShopStrip, StatCard } from "./components";
import { cars, formatCurrency } from "./data";
import { MarketplaceClient } from "./marketplace-client";

export default function Home() {
  const retailCount = cars.filter((car) => !car.isRepasse).length;
  const stockValue = cars
    .filter((car) => !car.isRepasse)
    .reduce((total, car) => total + car.price, 0);

  return (
    <>
      <GlobalNavigation />
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80"
            alt="Carro esportivo em destaque"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />
          <div className="relative mx-auto grid min-h-[620px] max-w-7xl content-center gap-8 px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.32em] text-blue-300">Marketplace automotivo hibrido</p>
              <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
                VitrineAuto
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-200">
                Vitrine publica para compradores, painel para lojistas e oportunidades de repasse em um fluxo rapido focado em conversao via WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#estoque" className="rounded-lg bg-blue-600 px-6 py-4 text-center text-sm font-black text-white">
                  Ver estoque
                </a>
                <Link href="/repasse" className="rounded-lg bg-white px-6 py-4 text-center text-sm font-black text-slate-950">
                  Area B2B
                </Link>
              </div>
            </div>
            <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
              <StatCard label="Carros no varejo" value={`${retailCount}`} />
              <StatCard label="Valor em vitrine" value={formatCurrency(stockValue)} tone="green" />
              <StatCard label="Contato direto" value="WhatsApp" tone="dark" />
            </div>
          </div>
        </section>
        <ShopStrip />
        <div id="estoque">
          <MarketplaceClient />
        </div>
      </main>
    </>
  );
}
