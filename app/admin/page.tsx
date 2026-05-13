import { AdminShell, StatCard } from "../components";
import { cars, formatCurrency, formatKm, getShop } from "../data";

export default function AdminPage() {
  const shop = getShop("prime");
  const myCars = cars.filter((car) => car.shopId === "prime");
  const stockValue = myCars.reduce((total, car) => total + car.price, 0);
  const views = myCars.reduce((total, car) => total + car.views, 0);
  const leads = myCars.reduce((total, car) => total + car.leads, 0);

  return (
    <AdminShell mode="shop">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Painel pessoal</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard do lojista</h1>
          <p className="mt-1 font-semibold text-slate-500">{shop?.name}</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white">Novo anuncio</button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Carros ativos" value={`${myCars.length}`} />
        <StatCard label="Valor em estoque" value={formatCurrency(stockValue)} tone="green" />
        <StatCard label="Visualizacoes" value={`${views}`} tone="dark" />
        <StatCard label="Interesses" value={`${leads}`} tone="blue" />
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Criar ou editar anuncio</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Placa", "Marca", "Nome do veiculo", "Cor", "Ano", "KM", "Preco a vista", "Preco FIPE"].map((field) => (
            <input key={field} className="field" placeholder={field} />
          ))}
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-black text-slate-700">
            <input type="checkbox" /> E repasse?
          </label>
          <textarea className="field textarea md:col-span-3" placeholder="Descricao, opcionais e observacoes de repasse" />
        </div>
        <button className="mt-4 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">Salvar anuncio</button>
      </section>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-slate-950">Meus anuncios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Veiculo</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Preco</th>
                <th className="px-5 py-3">KM</th>
                <th className="px-5 py-3">Leads</th>
                <th className="px-5 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCars.map((car) => (
                <tr key={car.id}>
                  <td className="px-5 py-4 font-black text-slate-950">{car.name}</td>
                  <td className="px-5 py-4">{car.isRepasse ? "Repasse" : "Varejo"}</td>
                  <td className="px-5 py-4">{formatCurrency(car.price)}</td>
                  <td className="px-5 py-4">{formatKm(car.km)}</td>
                  <td className="px-5 py-4">{car.leads}</td>
                  <td className="px-5 py-4">
                    <button className="mr-2 rounded-md border border-slate-200 px-3 py-2 font-bold">Editar</button>
                    <button className="rounded-md bg-red-50 px-3 py-2 font-bold text-red-700">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
