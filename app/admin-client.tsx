"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Car, formatCurrency, formatKm, optionals } from "./data";

type StoredUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  whatsapp: string;
  city: string;
  role: "USER" | "SHOP" | "MASTER";
  isActive: boolean;
};

const CARS_KEY = "vitrineauto.cars";
const USERS_KEY = "vitrineauto.users";
const SESSION_KEY = "vitrineauto.session";

const fallbackImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readCurrentUser() {
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  const sessionId = window.localStorage.getItem(SESSION_KEY);
  return users.find((user) => user.id === sessionId) ?? null;
}

function normalizeMoney(value: FormDataEntryValue | null) {
  const raw = String(value ?? "0").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  if (raw.includes(",")) return Number(digits) / 100;
  return Number(digits);
}

function normalizeNumber(value: FormDataEntryValue | null) {
  return Number(String(value ?? "0").replace(/\D/g, "")) || 0;
}

function formatCurrencyInput(value?: number) {
  return value ? formatCurrency(value) : "";
}

function formatKmInput(value?: number) {
  return value ? `${new Intl.NumberFormat("pt-BR").format(value)} km` : "";
}

function moneyMask(event: ChangeEvent<HTMLInputElement>) {
  const value = normalizeMoney(event.target.value);
  event.target.value = value ? formatCurrency(value) : "";
}

function kmMask(event: ChangeEvent<HTMLInputElement>) {
  const value = normalizeNumber(event.target.value);
  event.target.value = value ? formatKmInput(value) : "";
}

export function AdminInventoryClient({ seedCars }: { seedCars: Car[] }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [editing, setEditing] = useState<Car | null>(null);
  const [message, setMessage] = useState("");
  const [plateMessage, setPlateMessage] = useState("");
  const [consultingPlate, setConsultingPlate] = useState(false);
  const [repasseEnabled, setRepasseEnabled] = useState(false);
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentUser(readCurrentUser());
      setCars(readJson<Car[]>(CARS_KEY, seedCars));
    });
  }, [seedCars]);

  const shopId = currentUser?.id === "shop-prime" ? "prime" : currentUser?.id;
  const myCars = useMemo(
    () => cars.filter((car) => car.shopId === shopId || (!currentUser && car.shopId === "prime")),
    [cars, currentUser, shopId],
  );
  const stockValue = myCars.reduce((total, car) => total + car.price, 0);
  const views = myCars.reduce((total, car) => total + car.views, 0);
  const leads = myCars.reduce((total, car) => total + car.leads, 0);

  useEffect(() => {
    queueMicrotask(() => {
      setRepasseEnabled(Boolean(editing?.isRepasse));
      setSelectedOptionals(editing?.optional ?? []);
    });
  }, [editing]);

  function toggleOptional(item: string) {
    setSelectedOptionals((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  function persist(nextCars: Car[]) {
    setCars(nextCars);
    writeJson(CARS_KEY, nextCars);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const isRepasse = form.get("isRepasse") === "on";
    const ownerId = shopId ?? "prime";
    const image = String(form.get("image") ?? "").trim() || fallbackImage;

    const car: Car = {
      id: editing?.id ?? `car-${Date.now()}`,
      shopId: ownerId,
      name: String(form.get("name") ?? "").trim(),
      brand: String(form.get("brand") ?? "").trim(),
      plate: String(form.get("plate") ?? "").trim().toUpperCase(),
      color: String(form.get("color") ?? "").trim(),
      year: normalizeNumber(form.get("year")),
      km: normalizeNumber(form.get("km")),
      price: normalizeMoney(form.get("price")),
      fipe: normalizeMoney(form.get("fipe")),
      commission: isRepasse ? normalizeMoney(form.get("commission")) : undefined,
      description: String(form.get("description") ?? "").trim(),
      repasseNote: String(form.get("repasseNote") ?? "").trim(),
      isRepasse,
      views: editing?.views ?? 0,
      leads: editing?.leads ?? 0,
      optional: selectedOptionals,
      images: [image],
      shopName: currentUser?.name,
      shopUsername: currentUser?.username,
      shopWhatsapp: currentUser?.whatsapp,
      shopCity: currentUser?.city,
    };

    const nextCars = editing
      ? cars.map((item) => (item.id === editing.id ? car : item))
      : [car, ...cars];

    persist(nextCars);
    setEditing(null);
    setSelectedOptionals([]);
    setRepasseEnabled(false);
    setMessage(editing ? "Anuncio atualizado com sucesso." : "Anuncio criado com sucesso.");
    event.currentTarget.reset();
  }

  function remove(carId: string) {
    persist(cars.filter((car) => car.id !== carId));
    setMessage("Anuncio excluido.");
  }

  async function consultPlate() {
    const plateInput = document.querySelector<HTMLInputElement>("[name='plate']");
    const form = plateInput?.form;
    const placa = plateInput?.value.trim();

    if (!placa) {
      setPlateMessage("Informe a placa antes de consultar.");
      return;
    }

    setConsultingPlate(true);
    setPlateMessage("Consultando placa na API Brasil...");

    try {
      const response = await fetch("/api/placa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placa }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        setPlateMessage(data.message ?? "Nao foi possivel consultar esta placa.");
        return;
      }

      const vehicle = data.vehicle as {
        brand?: string;
        name?: string;
        color?: string;
        year?: number;
        fipe?: number;
      };

      const setValue = (name: string, value?: string | number) => {
        const input = form?.querySelector<HTMLInputElement>(`[name='${name}']`);
        if (input && value !== undefined && value !== "") {
          input.value = String(value);
        }
      };

      setValue("brand", vehicle.brand);
      setValue("name", vehicle.name);
      setValue("color", vehicle.color);
      setValue("year", vehicle.year);
      setValue("fipe", vehicle.fipe ? formatCurrency(vehicle.fipe) : "");
      setPlateMessage("Dados encontrados e preenchidos automaticamente.");
    } catch {
      setPlateMessage("Erro ao consultar a placa.");
    } finally {
      setConsultingPlate(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Painel pessoal</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Dashboard do lojista</h1>
          <p className="mt-1 font-semibold text-slate-500">{currentUser?.name ?? "Prime Motors"}</p>
        </div>
        <button onClick={() => { setEditing(null); setRepasseEnabled(false); setSelectedOptionals([]); }} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white">
          Novo anuncio
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <PanelStat label="Carros ativos" value={`${myCars.length}`} />
        <PanelStat label="Valor em estoque" value={formatCurrency(stockValue)} />
        <PanelStat label="Visualizacoes" value={`${views}`} />
        <PanelStat label="Interesses" value={`${leads}`} />
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">{editing ? "Editar anuncio" : "Criar anuncio"}</h2>
        {message && <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700">{message}</p>}
        <form key={editing?.id ?? "new"} onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="grid gap-2 md:col-span-3 lg:grid-cols-[1fr_auto]">
            <input name="plate" className="field" placeholder="Placa" defaultValue={editing?.plate} required />
            <button type="button" onClick={consultPlate} disabled={consultingPlate} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
              {consultingPlate ? "Consultando..." : "Consultar placa"}
            </button>
          </div>
          {plateMessage && <p className="rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-700 md:col-span-3">{plateMessage}</p>}
          <input name="brand" className="field" placeholder="Marca" defaultValue={editing?.brand} required />
          <input name="name" className="field" placeholder="Nome do veiculo" defaultValue={editing?.name} required />
          <input name="color" className="field" placeholder="Cor" defaultValue={editing?.color} required />
          <input name="year" className="field" placeholder="Ano" defaultValue={editing?.year} required />
          <input name="km" className="field" placeholder="KM" defaultValue={formatKmInput(editing?.km)} onBlur={kmMask} required />
          <input name="price" className="field" placeholder="Preco a vista" defaultValue={formatCurrencyInput(editing?.price)} onBlur={moneyMask} required />
          <input name="fipe" className="field" placeholder="Preco FIPE" defaultValue={formatCurrencyInput(editing?.fipe)} onBlur={moneyMask} required />
          <input name="image" className="field md:col-span-2" placeholder="URL da foto" defaultValue={editing?.images[0]} />
          <label className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 text-sm font-black ${repasseEnabled ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 text-slate-700"}`}>
            <input name="isRepasse" type="checkbox" checked={repasseEnabled} onChange={(event) => setRepasseEnabled(event.target.checked)} /> E repasse?
          </label>
          <details className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-3" open>
            <summary className="cursor-pointer text-sm font-black text-slate-800">Opcionais do veiculo</summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {optionals.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black ${selectedOptionals.includes(item) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  <input type="checkbox" checked={selectedOptionals.includes(item)} onChange={() => toggleOptional(item)} />
                  {item}
                </label>
              ))}
            </div>
          </details>
          <textarea name="description" className="field textarea md:col-span-3" placeholder="Descricao" defaultValue={editing?.description} />
          {repasseEnabled && (
            <div className="grid gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 md:col-span-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-black text-amber-900">Comissao do repasse</label>
                <input name="commission" className="field mt-2 border-amber-300 bg-white" placeholder="R$ 2.000,00" defaultValue={formatCurrencyInput(editing?.commission)} onBlur={moneyMask} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-black text-amber-900">Observacoes especificas do repasse</label>
                <textarea name="repasseNote" className="field textarea mt-2 border-amber-300 bg-white" placeholder="Detalhes para lojistas e repassadores" defaultValue={editing?.repasseNote} />
              </div>
            </div>
          )}
          <button className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white">
            {editing ? "Salvar alteracoes" : "Salvar anuncio"}
          </button>
        </form>
      </section>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-slate-950">Meus anuncios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Veiculo</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Preco</th>
                <th className="px-5 py-3">KM</th>
                <th className="px-5 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCars.map((car) => (
                <tr key={car.id}>
                  <td className="px-5 py-4 font-black text-slate-950">{car.name}</td>
                  <td className="px-5 py-4">{car.isRepasse ? "Repasse" : "Varejo"}</td>
                  <td className="px-5 py-4">{formatCurrency(car.price)}</td>
                  <td className="px-5 py-4">{formatKm(car.km)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setEditing(car)} className="mr-2 rounded-md border border-slate-200 px-3 py-2 font-bold">Editar</button>
                    <button onClick={() => remove(car.id)} className="rounded-md bg-red-50 px-3 py-2 font-bold text-red-700">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function StoreSettingsClient({ seedCars }: { seedCars: Car[] }) {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentUser(readCurrentUser());
      setCars(readJson<Car[]>(CARS_KEY, seedCars));
    });
  }, [seedCars]);

  const shopId = currentUser?.id === "shop-prime" ? "prime" : currentUser?.id;
  const stock = cars.filter((car) => car.shopId === shopId || (!currentUser && car.shopId === "prime"));
  const storeName = currentUser?.name ?? "Prime Motors";
  const city = currentUser?.city ?? "Sao Paulo, SP";

  return (
    <>
      <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Minha loja</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">Configuracoes da vitrine</h1>

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="h-56 bg-slate-200">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80" alt="Capa da loja" className="h-full w-full object-cover" />
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80" alt="Perfil da loja" className="-mt-16 h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
            <div className="pb-2">
              <h2 className="text-2xl font-black text-slate-950">{storeName}</h2>
              <p className="font-semibold text-slate-500">{city}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Foto de perfil
              <input className="field" type="file" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Foto de capa
              <input className="field" type="file" />
            </label>
            <input className="field" defaultValue={storeName} />
            <input className="field" defaultValue={city} />
          </div>
          <button className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white">Salvar perfil</button>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-slate-950">Carros publicados pela loja</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Veiculo</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Preco</th>
                <th className="px-5 py-3">KM</th>
                <th className="px-5 py-3">Ano</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stock.map((car) => (
                <tr key={car.id}>
                  <td className="px-5 py-4 font-black text-slate-950">{car.name}</td>
                  <td className="px-5 py-4">{car.isRepasse ? "Repasse" : "Varejo"}</td>
                  <td className="px-5 py-4">{formatCurrency(car.price)}</td>
                  <td className="px-5 py-4">{formatKm(car.km)}</td>
                  <td className="px-5 py-4">{car.year}</td>
                </tr>
              ))}
              {stock.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-slate-500" colSpan={5}>Nenhum carro publicado ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function MasterUsersClient({ seedUsers, seedCars }: { seedUsers: StoredUser[]; seedCars: Car[] }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setUsers(readJson<StoredUser[]>(USERS_KEY, seedUsers));
      setCars(readJson<Car[]>(CARS_KEY, seedCars));
    });
  }, [seedCars, seedUsers]);

  function toggle(userId: string) {
    const nextUsers = users.map((user) =>
      user.id === userId && user.role !== "MASTER" ? { ...user, isActive: !user.isActive } : user,
    );
    setUsers(nextUsers);
    writeJson(USERS_KEY, nextUsers);
  }

  return (
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
                <td className="px-5 py-4">{cars.filter((car) => car.shopId === user.id || (user.id === "shop-prime" && car.shopId === "prime")).length}</td>
                <td className="px-5 py-4">
                  <button onClick={() => toggle(user.id)} className={`rounded-md px-3 py-2 font-black ${user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {user.isActive ? "Ativo" : "Bloqueado"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MasterCarsClient({ seedCars }: { seedCars: Car[] }) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setCars(readJson<Car[]>(CARS_KEY, seedCars));
    });
  }, [seedCars]);

  function remove(carId: string) {
    const nextCars = cars.filter((car) => car.id !== carId);
    setCars(nextCars);
    writeJson(CARS_KEY, nextCars);
  }

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Carro</th>
              <th className="px-5 py-3">Loja</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Preco</th>
              <th className="px-5 py-3">Ano</th>
              <th className="px-5 py-3">KM</th>
              <th className="px-5 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-5 py-4 font-black text-slate-950">{car.name}</td>
                <td className="px-5 py-4">{car.shopId}</td>
                <td className="px-5 py-4">{car.isRepasse ? "Repasse" : "Varejo"}</td>
                <td className="px-5 py-4">{formatCurrency(car.price)}</td>
                <td className="px-5 py-4">{car.year}</td>
                <td className="px-5 py-4">{formatKm(car.km)}</td>
                <td className="px-5 py-4">
                  <button onClick={() => remove(car.id)} className="rounded-md bg-red-50 px-3 py-2 font-bold text-red-700">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
