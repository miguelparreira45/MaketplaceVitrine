import { GlobalNavigation } from "../components";
import { cars } from "../data";
import { RepasseClient } from "./repasse-client";

export default function RepassePage() {
  const repasseCars = cars.filter((car) => car.isRepasse);

  return (
    <>
      <GlobalNavigation mode="shop" />
      <main className="bg-slate-100">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-amber-600">Oportunidades B2B</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">Area de repasse</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Ambiente reservado para lojistas e investidores avaliarem oportunidades com comissao, FIPE e observacoes de negociacao.
            </p>
          </div>
        </section>
        <RepasseClient cars={repasseCars} />
      </main>
    </>
  );
}
