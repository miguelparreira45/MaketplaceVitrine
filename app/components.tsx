import Link from "next/link";
import { AuthStatus, RequirePanelAccess, ShopSidebarLinks, UserNavigationLinks } from "./auth-client";
import { Car, formatCurrency, formatKm, getShop, shops } from "./data";

export function GlobalNavigation({ mode = "public" }: { mode?: "public" | "shop" | "master" }) {
  const isMaster = mode === "master";
  const isShop = mode === "shop";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-lg text-sm font-black text-white ${isMaster ? "bg-red-600" : isShop ? "bg-blue-600" : "bg-slate-950"}`}>
            VA
          </span>
          <span>
            <span className="block text-base font-black text-slate-950">VitrineAuto</span>
            <span className="block text-xs font-semibold text-slate-500">
              {isMaster ? "Ambiente Master" : isShop ? "Ambiente Lojista" : "Marketplace automotivo"}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <UserNavigationLinks />
        </nav>
        <AuthStatus />
      </div>
    </header>
  );
}

export function AdminShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "shop" | "master";
}) {
  const master = mode === "master";
  return (
    <div className="min-h-screen bg-slate-100">
      <RequirePanelAccess mode={mode} />
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-slate-950 p-5 text-white lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-lg font-black ${master ? "bg-red-600" : "bg-blue-600"}`}>VA</span>
          <span>
            <span className="block font-black">VitrineAuto</span>
            <span className="text-xs text-slate-400">{master ? "Ferramentas Master" : "Painel do Lojista"}</span>
          </span>
        </Link>
        {master && (
          <div className="mb-5 rounded-lg bg-red-600 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-red-100">Ferramentas Master</p>
            <p className="mt-1 text-sm font-semibold">Controle total da plataforma</p>
          </div>
        )}
        <nav className="grid gap-2 text-sm font-semibold">
          <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href={master ? "/master" : "/admin"}>
            Visao geral
          </Link>
          {master ? (
            <>
              <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href="/master/users">Gerenciar usuarios</Link>
              <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href="/master/cars">Estoque geral</Link>
            </>
          ) : (
            <ShopSidebarLinks />
          )}
          <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href="/">Sair</Link>
        </nav>
      </aside>
      <main className="lg:pl-72">
        <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="font-black text-slate-950">{master ? "Master" : "Lojista"}</div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export function CarCard({ car, b2b = false }: { car: Car; b2b?: boolean }) {
  const shop = getShop(car.shopId);
  const message = encodeURIComponent(`Ola, vi o ${car.name} na VitrineAuto e tenho interesse.`);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-slate-200">
        <img src={car.images[0]} alt={car.name} className="h-full w-full object-cover" />
        {b2b && <span className="absolute left-3 top-3 rounded-md bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">REPASSE</span>}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-black text-slate-950">{car.name}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{car.year}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">{shop?.name} - {shop?.city}</p>
        </div>
        {b2b ? (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Repasse" value={formatCurrency(car.price)} />
            <Metric label="Comissao" value={formatCurrency(car.commission ?? 0)} accent />
          </div>
        ) : (
          <p className="text-2xl font-black text-blue-700">{formatCurrency(car.price)}</p>
        )}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
          <span className="rounded-md bg-slate-50 p-2">{formatKm(car.km)}</span>
          <span className="rounded-md bg-slate-50 p-2">{car.color}</span>
          <span className="rounded-md bg-slate-50 p-2">{car.brand}</span>
        </div>
        <div className="flex gap-2">
          <Link href={b2b ? `/repasse#${car.id}` : `/loja/${shop?.username}`} className="flex-1 rounded-lg border border-slate-200 px-3 py-3 text-center text-sm font-black text-slate-800">
            Ver detalhes
          </Link>
          <a href={`https://wa.me/${shop?.whatsapp}?text=${message}`} className="flex-1 rounded-lg bg-green-600 px-3 py-3 text-center text-sm font-black text-white">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-black ${accent ? "text-green-600" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

export function StatCard({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "green" | "red" | "dark" }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-green-100 bg-green-50 text-green-700",
    red: "border-red-100 bg-red-50 text-red-700",
    dark: "border-slate-200 bg-white text-slate-950",
  };
  return (
    <div className={`rounded-lg border p-5 ${tones[tone]}`}>
      <p className="text-sm font-bold opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

export function ShopStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {shops.map((shop) => (
          <Link key={shop.id} href={`/loja/${shop.username}`} className="flex min-w-72 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <img src={shop.avatar} alt={shop.name} className="h-14 w-14 rounded-full object-cover" />
            <span>
              <span className="block font-black text-slate-950">{shop.name}</span>
              <span className="block text-sm font-semibold text-slate-500">{shop.city}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
