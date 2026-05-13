"use client";

import { useMemo, useState } from "react";
import { CarCard } from "./components";
import { cars, optionals } from "./data";

export function MarketplaceClient() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const retailCars = useMemo(() => {
    return cars.filter((car) => {
      const text = `${car.name} ${car.plate} ${car.brand}`.toLowerCase();
      const matchesText = text.includes(query.toLowerCase());
      const matchesBrand = !brand || car.brand === brand;
      const matchesColor = !color || car.color === color;
      const matchesMinPrice = !minPrice || car.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || car.price <= Number(maxPrice);
      const matchesMinYear = !minYear || car.year >= Number(minYear);
      const matchesMaxYear = !maxYear || car.year <= Number(maxYear);
      const matchesOptional = selected.every((item) => car.optional.includes(item));
      return !car.isRepasse && matchesText && matchesBrand && matchesColor && matchesMinPrice && matchesMaxPrice && matchesMinYear && matchesMaxYear && matchesOptional;
    });
  }, [brand, color, maxPrice, maxYear, minPrice, minYear, query, selected]);

  const brands = Array.from(new Set(cars.map((car) => car.brand))).sort();
  const colors = Array.from(new Set(cars.map((car) => car.color))).sort();

  function toggleOptional(item: string) {
    setSelected((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
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
          <input className="field" placeholder="Ano min." inputMode="numeric" value={minYear} onChange={(event) => setMinYear(event.target.value)} />
          <input className="field" placeholder="Ano max." inputMode="numeric" value={maxYear} onChange={(event) => setMaxYear(event.target.value)} />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {optionals.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleOptional(item)}
              className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black ${selected.includes(item) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {item}
            </button>
          ))}
        </div>
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
