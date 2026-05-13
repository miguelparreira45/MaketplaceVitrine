import Link from "next/link";
import { LoginForm } from "../auth-client";
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
            Use seu usuario e senha. O administrador inicial continua sendo admin / 123.
          </p>
          <LoginForm />
          <p className="mt-5 text-center text-sm font-semibold text-slate-500">
            Ainda nao tem conta? <Link className="text-blue-700" href="/cadastro">Cadastre-se</Link>
          </p>
        </section>
      </main>
    </>
  );
}
