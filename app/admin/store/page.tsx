import { AdminShell } from "../../components";
import { getShop } from "../../data";

export default function StoreSettingsPage() {
  const shop = getShop("prime");

  return (
    <AdminShell mode="shop">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Minha loja</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Configuracoes da vitrine</h1>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative h-56">
          <img src={shop?.cover} alt="Capa da loja" className="h-full w-full object-cover" />
        </div>
        <div className="p-5">
          <div className="-mt-20 flex items-end gap-4">
            <img src={shop?.avatar} alt="Perfil da loja" className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
            <div className="pb-3">
              <h2 className="text-2xl font-black text-slate-950">{shop?.name}</h2>
              <p className="font-semibold text-slate-500">{shop?.city}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Foto de perfil
              <input className="field" type="file" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Foto de capa
              <input className="field" type="file" />
            </label>
            <input className="field" defaultValue={shop?.name} />
            <input className="field" defaultValue={shop?.city} />
          </div>
          <button className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white">Salvar perfil</button>
        </div>
      </section>
    </AdminShell>
  );
}
