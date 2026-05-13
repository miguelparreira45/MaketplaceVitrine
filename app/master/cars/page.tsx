import { MasterCarsClient } from "../../admin-client";
import { AdminShell } from "../../components";
import { cars } from "../../data";

export default function MasterCarsPage() {
  return (
    <AdminShell mode="master">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Estoque geral</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Torre de controle</h1>
      <MasterCarsClient seedCars={cars} />
    </AdminShell>
  );
}
