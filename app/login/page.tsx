import Link from "next/link";
import { GlobalNavigation } from "../components";

export default function LoginPage() {
  return (
    <>
      <GlobalNavigation />
      <main className="grid min-h-[calc(100vh-73px)] place-items-center bg-slate-100 px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Acesso seguro</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Entrar na VitrineAuto</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Demo funcional: use admin / 123 para imaginar o Master ou qualquer lojista para o painel.
          </p>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Usuario
              <input className="field" defaultValue="admin" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Senha
              <input className="field" type="password" defaultValue="123" />
            </label>
            <Link href="/master" className="rounded-lg bg-blue-600 px-5 py-4 text-center text-sm font-black text-white">
              Entrar como Master
            </Link>
            <Link href="/admin" className="rounded-lg border border-slate-200 px-5 py-4 text-center text-sm font-black text-slate-800">
              Entrar como Lojista
            </Link>
          </form>
          <p className="mt-5 text-center text-sm font-semibold text-slate-500">
            Ainda nao tem conta? <Link className="text-blue-700" href="/cadastro">Cadastre-se</Link>
          </p>
        </section>
      </main>
    </>
  );
}
