import { AdminShell } from "../../components";
import { getCarsByShop, users } from "../../data";

export default function MasterUsersPage() {
  return (
    <AdminShell mode="master">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-600">Usuarios</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Gerenciador de usuarios</h1>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Telefone</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Carros</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 font-black text-slate-950">{user.name}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.whatsapp}</td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{getCarsByShop(user.id).length}</td>
                  <td className="px-5 py-4">
                    <button className={`rounded-md px-3 py-2 font-black ${user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {user.isActive ? "Ativo" : "Bloqueado"}
                    </button>
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
