"use client";

import { useEffect, useMemo, useState } from "react";
import { CarCard } from "./components";
import { Car, cars, optionals } from "./data";

const CARS_KEY = "vitrineauto.cars";

function readCars() {
  const stored = window.localStorage.getItem(CARS_KEY);
  if (!stored) {
    window.localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return cars;
  }
  try {
    return JSON.parse(stored) as Car[];
  } catch {
    window.localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return cars;
  }
}

function normalizeMoney(value: string) {
  const raw = value.trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  if (raw.includes(",")) return Number(digits) / 100;
  return Number(digits);
}

export function MarketplaceClient() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [allCars, setAllCars] = useState<Car[]>(cars);

  useEffect(() => {
    queueMicrotask(() => setAllCars(readCars()));
  }, []);

  const retailCars = useMemo(() => {
    return allCars.filter((car) => {
      const text = `${car.name} ${car.plate} ${car.brand}`.toLowerCase();
      const matchesText = text.includes(query.toLowerCase());
      const matchesBrand = !brand || car.brand === brand;
      const matchesColor = !color || car.color === color;
      const matchesMinPrice = !minPrice || car.price >= normalizeMoney(minPrice);
      const matchesMaxPrice = !maxPrice || car.price <= normalizeMoney(maxPrice);
      const matchesMinYear = !minYear || car.year >= Number(minYear);
      const matchesMaxYear = !maxYear || car.year <= Number(maxYear);
      const matchesOptional = selected.every((item) => car.optional.includes(item));
      return !car.isRepasse && matchesText && matchesBrand && matchesColor && matchesMinPrice && matchesMaxPrice && matchesMinYear && matchesMaxYear && matchesOptional;
    });
  }, [allCars, brand, color, maxPrice, maxYear, minPrice, minYear, query, selected]);

  const brands = Array.from(new Set(allCars.map((car) => car.brand))).sort();
  const colors = Array.from(new Set(allCars.map((car) => car.color))).sort();
  const allOptionals = Array.from(new Set([...optionals, ...allCars.flatMap((car) => car.optional)])).sort();

  function toggleOptional(item: string) {
    setSelected((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="field md:col-span-2" placeholder="Buscar por nome ou placa" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="field" value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">Marca</option>
            {brands.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={color} onChange={(event) => setColor(event.target.value)}>
            <option value="">Cor</option>
            {colors.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="field" placeholder="Preco min." inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
          <input className="field" placeholder="Preco max." inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </div>
        <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-black text-slate-800">Filtros avancados</summary>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input className="field" placeholder="Ano min." inputMode="numeric" value={minYear} onChange={(event) => setMinYear(event.target.value)} />
          <input className="field" placeholder="Ano max." inputMode="numeric" value={maxYear} onChange={(event) => setMaxYear(event.target.value)} />
          </div>
        </details>
        <details className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-black text-slate-800">Opcionais</summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {allOptionals.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black ${selected.includes(item) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
              >
                <input type="checkbox" checked={selected.includes(item)} onChange={() => toggleOptional(item)} />
                {item}
              </label>
            ))}
          </div>
        </details>
        {selected.length > 0 && (
          <button type="button" onClick={() => setSelected([])} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">
            Limpar opcionais
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">Vitrine principal</h2>
        <p className="text-sm font-bold text-slate-500">{retailCars.length} veiculos encontrados</p>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {retailCars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </section>
  );
}
