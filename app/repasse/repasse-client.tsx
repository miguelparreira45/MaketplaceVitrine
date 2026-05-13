"use client";

import { useState } from "react";
import { CarCard } from "../components";
import { Car, formatCurrency, formatKm, getShop } from "../data";

export function RepasseClient({ cars }: { cars: Car[] }) {
  const [selected, setSelected] = useState<Car | null>(cars[0] ?? null);
  const shop = selected ? getShop(selected.shopId) : null;
  const message = selected && shop
    ? encodeURIComponent(`Ola, vi o repasse do ${selected.name} na VitrineAuto e tenho interesse.`)
    : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <button key={car.id} id={car.id} type="button" onClick={() => setSelected(car)} className="text-left">
            <CarCard car={car} b2b />
          </button>
        ))}
      </div>

      {selected && shop && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4">
          <div className="grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-slate-950 p-3">
              <img src={selected.images[0]} alt={selected.name} className="h-full min-h-[320px] w-full rounded-lg object-cover" />
            </div>
            <div className="overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-md bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">REPASSE</span>
                  <h2 className="mt-3 text-3xl font-black text-slate-950">{selected.name}</h2>
                  <p className="mt-1 font-semibold text-slate-500">{shop.name} - {shop.city}</p>
                </div>
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black">
                  Fechar
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Info label="Valor de repasse" value={formatCurrency(selected.price)} />
                <Info label="Sua comissao" value={formatCurrency(selected.commission ?? 0)} green />
                <Info label="FIPE" value={formatCurrency(selected.fipe)} />
                <Info label="KM" value={formatKm(selected.km)} />
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">{selected.description}</p>
              <p className="mt-3 rounded-lg bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">{selected.repasseNote}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.optional.map((item) => (
                  <span key={item} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">{item}</span>
                ))}
              </div>
              <a href={`https://wa.me/${shop.whatsapp}?text=${message}`} className="mt-6 block rounded-lg bg-green-600 px-5 py-4 text-center text-base font-black text-white">
                Negociar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-black ${green ? "text-green-600" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}
