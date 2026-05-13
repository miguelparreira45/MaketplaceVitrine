import { AdminShell, StatCard } from "../components";
import { cars, formatCurrency, shops, users } from "../data";

export default function MasterPage() {
  const totalValue = cars.reduce((total, car) => total + car.price, 0);
  const views = cars.reduce((total, car) => total + car.views, 0) + shops.reduce((total, shop) => total + shop.views, 0);
  const leads = cars.reduce((total, car) => total + car.leads, 0);

  return (
    <AdminShell mode="master">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Controle total</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard Master</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Usuarios" value={`${users.length}`} tone="red" />
        <StatCard label="Carros totais" value={`${cars.length}`} />
        <StatCard label="Soma financeira" value={formatCurrency(totalValue)} tone="green" />
        <StatCard label="Cliques e views" value={`${views + leads}`} tone="dark" />
      </div>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Resumo da plataforma</h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Esta area representa a visao global para o dono da plataforma. Quando o PostgreSQL estiver conectado, os numeros virao de consultas reais em User, Car e Gallery.
        </p>
      </section>
    </AdminShell>
  );
}
