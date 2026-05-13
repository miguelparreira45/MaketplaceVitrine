import { AdminShell } from "../../components";
import { cars, formatCurrency, formatKm, getShop } from "../../data";

export default function MasterCarsPage() {
  return (
    <AdminShell mode="master">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Estoque geral</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Torre de controle</h1>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Carro</th>
                <th className="px-5 py-3">Loja</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Preco</th>
                <th className="px-5 py-3">Ano</th>
                <th className="px-5 py-3">KM</th>
                <th className="px-5 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-5 py-4 font-black text-slate-950">{car.name}</td>
                  <td className="px-5 py-4">{getShop(car.shopId)?.name}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-md px-3 py-1 text-xs font-black ${car.isRepasse ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {car.isRepasse ? "Repasse" : "Varejo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">{formatCurrency(car.price)}</td>
                  <td className="px-5 py-4">{car.year}</td>
                  <td className="px-5 py-4">{formatKm(car.km)}</td>
                  <td className="px-5 py-4">
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
