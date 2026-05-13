import { GlobalNavigation } from "../components";

export default function RegisterPage() {
  return (
    <>
      <GlobalNavigation />
      <main className="bg-slate-100 px-4 py-10">
        <section className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Cadastro</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Crie sua conta</h1>
          <p className="mt-2 text-slate-600">Estrutura preparada para PF e PJ, com validacao de usuario duplicado quando o banco for conectado.</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <FormCard title="Pessoa Fisica" role="USER" fields={["Nome", "Usuario", "Senha", "E-mail", "WhatsApp", "Cidade", "CPF"]} />
            <FormCard title="Pessoa Juridica" role="SHOP" fields={["Nome da loja", "Usuario", "Senha", "E-mail", "WhatsApp", "Cidade", "CNPJ", "Endereco completo"]} />
          </div>
        </section>
      </main>
    </>
  );
}

function FormCard({ title, role, fields }: { title: string; role: string; fields: string[] }) {
  return (
    <form className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{role}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {fields.map((field) => (
          <input key={field} className="field" placeholder={field} type={field === "Senha" ? "password" : "text"} />
        ))}
      </div>
      <button type="button" className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-4 text-sm font-black text-white">
        Criar cadastro
      </button>
    </form>
  );
}
