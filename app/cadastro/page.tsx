import { RegisterForms } from "../auth-client";
import { GlobalNavigation } from "../components";

export default function RegisterPage() {
  return (
    <>
      <GlobalNavigation />
      <main className="bg-slate-100 px-4 py-10">
        <section className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Cadastro</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Crie sua conta</h1>
          <p className="mt-2 text-slate-600">
            Escolha PF ou PJ. O sistema bloqueia nomes de usuario duplicados e ja deixa a sessao conectada apos o cadastro.
          </p>
          <RegisterForms />
        </section>
      </main>
    </>
  );
}
