"use client";

import { useEffect, useMemo, useState } from "react";
import { CarCard, StatCard } from "./components";
import { Car, Shop, cars as seedCars, getCarsByShop, shops as seedShops } from "./data";
import { readUsers, StoredUser } from "./auth-client";

const CARS_KEY = "vitrineauto.cars";
const fallbackCover =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";
const fallbackAvatar =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80";

function readCars() {
  const stored = window.localStorage.getItem(CARS_KEY);
  if (!stored) {
    window.localStorage.setItem(CARS_KEY, JSON.stringify(seedCars));
    return seedCars;
  }
  try {
    return JSON.parse(stored) as Car[];
  } catch {
    window.localStorage.setItem(CARS_KEY, JSON.stringify(seedCars));
    return seedCars;
  }
}

function userToShop(user: StoredUser): Shop {
  return {
    id: user.id === "shop-prime" ? "prime" : user.id,
    name: user.name,
    username: user.username,
    city: user.city,
    whatsapp: user.whatsapp,
    isVerified: false,
    isActive: user.isActive,
    cover: fallbackCover,
    avatar: fallbackAvatar,
    views: 0,
  };
}

export function StorefrontClient({ username }: { username: string }) {
  const [cars, setCars] = useState<Car[]>(seedCars);
  const [shops, setShops] = useState<Shop[]>(seedShops);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const shopUsers = readUsers()
        .filter((user) => user.role === "SHOP")
        .map(userToShop);
      const merged = [...seedShops];
      for (const shop of shopUsers) {
        const index = merged.findIndex((item) => item.username === shop.username || item.id === shop.id);
        if (index >= 0) merged[index] = { ...merged[index], ...shop };
        else merged.push(shop);
      }
      setShops(merged);
      setCars(readCars());
    });
  }, []);

  const shop = shops.find((item) => item.username === username && item.isActive);
  const stock = useMemo(() => {
    if (!shop) return [];
    const legacy = getCarsByShop(shop.id);
    return cars
      .filter((car) => (car.shopId === shop.id || legacy.some((item) => item.id === car.id)) && !car.isRepasse)
      .filter((car, index, list) => list.findIndex((item) => item.id === car.id) === index);
  }, [cars, shop]);
  const leads = cars.filter((car) => shop && car.shopId === shop.id).reduce((total, car) => total + car.leads, 0);

  async function shareStore() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: shop?.name ?? "VitrineAuto", url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  if (!shop) {
    return (
      <main className="grid min-h-[calc(100vh-73px)] place-items-center bg-slate-100 px-4">
        <div className="rounded-lg bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">Loja nao encontrada</h1>
          <p className="mt-2 text-slate-600">Confira se o link divulgado pelo lojista esta correto.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-100">
      <section className="bg-white">
        <div className="relative h-72 overflow-hidden md:h-96">
          <img src={shop.cover} alt={shop.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end">
            <img src={shop.avatar} alt={shop.name} className="relative h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl" />
            <div className="relative rounded-lg bg-white p-4 shadow-sm md:flex-1">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black text-slate-950">{shop.name}</h1>
                    {shop.isVerified && <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">Loja verificada</span>}
                  </div>
                  <p className="mt-1 font-semibold text-slate-500">{shop.city} - @{shop.username}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button onClick={shareStore} className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-black text-slate-800">
                    {copied ? "Link copiado" : "Compartilhar loja"}
                  </button>
                  <a href={`https://wa.me/${shop.whatsapp}`} className="rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-black text-white">
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Veiculos em estoque" value={`${stock.length}`} />
            <StatCard label="Visualizacoes" value={`${shop.views}`} tone="dark" />
            <StatCard label="Interesses gerados" value={`${leads}`} tone="green" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-slate-950">Estoque exclusivo</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stock.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
        {stock.length === 0 && (
          <div className="mt-5 rounded-lg bg-white p-6 text-slate-600 shadow-sm">
            Esta loja ainda nao possui carros publicados.
          </div>
        )}
      </section>
    </main>
  );
}
