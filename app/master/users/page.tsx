import { MasterUsersClient } from "../../admin-client";
import { AdminShell } from "../../components";
import { cars, users } from "../../data";

export default function MasterUsersPage() {
  return (
    <AdminShell mode="master">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Usuarios</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Gerenciador de usuarios</h1>
      <MasterUsersClient seedUsers={users} seedCars={cars} />
    </AdminShell>
  );
}
