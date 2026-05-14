"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Role = "USER" | "SHOP" | "MASTER";

export type StoredUser = {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  whatsapp: string;
  city: string;
  role: Role;
  isActive: boolean;
  document: string;
  address?: string;
};

const USERS_KEY = "vitrineauto.users";
const SESSION_KEY = "vitrineauto.session";

export const seedUsers: StoredUser[] = [
  {
    id: "master-admin",
    name: "Administrador",
    username: "admin",
    password: "123",
    email: "admin@vitrineauto.com",
    whatsapp: "5511000000000",
    city: "Brasil",
    role: "MASTER",
    isActive: true,
    document: "00000000000",
  },
  {
    id: "shop-prime",
    name: "Prime Motors",
    username: "primemotors",
    password: "123",
    email: "prime@vitrineauto.com",
    whatsapp: "5511999999999",
    city: "Sao Paulo, SP",
    role: "SHOP",
    isActive: true,
    document: "00000000000100",
    address: "Av. Automotiva, 100",
  },
];

export function readUsers() {
  if (typeof window === "undefined") return seedUsers;
  const stored = window.localStorage.getItem(USERS_KEY);
  if (!stored) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }

  try {
    const users = JSON.parse(stored) as StoredUser[];
    const hasAdmin = users.some((user) => user.username.toLowerCase() === "admin");
    if (!hasAdmin) {
      const merged = [...seedUsers, ...users];
      window.localStorage.setItem(USERS_KEY, JSON.stringify(merged));
      return merged;
    }
    return users;
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function saveUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSession() {
  if (typeof window === "undefined") return null;
  const sessionId = window.localStorage.getItem(SESSION_KEY);
  if (!sessionId) return null;
  return readUsers().find((user) => user.id === sessionId) ?? null;
}

function setSession(user: StoredUser | null) {
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("vitrineauto-auth"));
    return;
  }
  window.localStorage.setItem(SESSION_KEY, user.id);
  window.dispatchEvent(new Event("vitrineauto-auth"));
}

function dashboardFor(role: Role) {
  if (role === "MASTER") return "/master";
  if (role === "SHOP") return "/admin";
  return "/";
}

function storePathFor(user: StoredUser | null) {
  return user?.role === "SHOP" ? `/loja/${user.username}` : "/";
}

export function UserNavigationLinks() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(readSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vitrineauto-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vitrineauto-auth", sync);
    };
  }, []);

  return (
    <>
      <Link href="/">Vitrine</Link>
      <Link href="/repasse">Repasse B2B</Link>
      {user?.role === "SHOP" && <Link href={storePathFor(user)}>Minha loja</Link>}
      {!user && <Link href="/loja/primemotors">Loja exemplo</Link>}
    </>
  );
}

export function ShopSidebarLinks() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(readSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vitrineauto-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vitrineauto-auth", sync);
    };
  }, []);

  return (
    <>
      <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href="/repasse">Area B2B</Link>
      <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href="/admin/store">Minha loja</Link>
      <Link className="rounded-lg px-3 py-3 hover:bg-white/10" href={storePathFor(user)}>Ver vitrine</Link>
    </>
  );
}

export function AuthStatus() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sync = () => setUser(readSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("vitrineauto-auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vitrineauto-auth", sync);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800">
          Entrar
        </Link>
        <Link href="/cadastro" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
          Anunciar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={dashboardFor(user.role)} className={`rounded-lg px-4 py-2 text-sm font-black text-white ${user.role === "MASTER" ? "bg-red-600" : "bg-blue-600"}`}>
        {user.name}
      </Link>
      <button
        type="button"
        onClick={() => {
          setSession(null);
          router.push("/");
        }}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800"
      >
        Sair
      </button>
    </div>
  );
}

export function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");
  const [message, setMessage] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const users = readUsers();
    const user = users.find((item) => item.username.toLowerCase() === username.trim().toLowerCase());

    if (!user || user.password !== password) {
      setMessage("Usuario ou senha invalidos.");
      return;
    }

    if (!user.isActive) {
      setMessage("Conta suspensa pelo Administrador");
      return;
    }

    setSession(user);
    router.push(dashboardFor(user.role));
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm font-black text-slate-700">
        Usuario
        <input className="field" value={username} onChange={(event) => setUsername(event.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm font-black text-slate-700">
        Senha
        <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {message && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>}
      <button type="submit" className="rounded-lg bg-blue-600 px-5 py-4 text-center text-sm font-black text-white">
        Entrar
      </button>
    </form>
  );
}

export function RegisterForms() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <RegisterForm title="Pessoa Fisica" role="USER" documentLabel="CPF" />
      <RegisterForm title="Pessoa Juridica" role="SHOP" documentLabel="CNPJ" withAddress />
    </div>
  );
}

function RegisterForm({
  title,
  role,
  documentLabel,
  withAddress = false,
}: {
  title: string;
  role: Role;
  documentLabel: string;
  withAddress?: boolean;
}) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const users = readUsers();
    const duplicate = users.some((user) => user.username.toLowerCase() === username.toLowerCase());

    if (duplicate) {
      setMessage("Nome de usuario ja cadastrado. Escolha outro login.");
      return;
    }

    const user: StoredUser = {
      id: `${role.toLowerCase()}-${Date.now()}`,
      name: String(form.get("name") ?? "").trim(),
      username,
      password: String(form.get("password") ?? ""),
      email: String(form.get("email") ?? "").trim(),
      whatsapp: String(form.get("whatsapp") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      role,
      isActive: true,
      document: String(form.get("document") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
    };

    saveUsers([...users, user]);
    setSession(user);
    router.push(dashboardFor(user.role));
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{role}</span>
      </div>
      <div className="mt-4 grid gap-3">
        <input className="field" name="name" placeholder={role === "SHOP" ? "Nome da loja" : "Nome"} required />
        <input className="field" name="username" placeholder="Usuario" required />
        <input className="field" name="password" placeholder="Senha" type="password" required minLength={3} />
        <input className="field" name="email" placeholder="E-mail" type="email" required />
        <input className="field" name="whatsapp" placeholder="WhatsApp" required />
        <input className="field" name="city" placeholder="Cidade" required />
        <input className="field" name="document" placeholder={documentLabel} required />
        {withAddress && <input className="field" name="address" placeholder="Endereco completo" required />}
      </div>
      {message && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>}
      <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-4 text-sm font-black text-white">
        Criar cadastro
      </button>
    </form>
  );
}

export function RequirePanelAccess({ mode }: { mode: "shop" | "master" }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = readSession();
    const canAccess = user ? (mode === "master" ? user.role === "MASTER" : user.role === "SHOP") : false;
    queueMicrotask(() => {
      setAllowed(canAccess);
      setChecked(true);
    });
    if (!canAccess) {
      router.replace("/login");
    }
  }, [mode, router]);

  if (!checked || allowed) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/80 p-4">
      <div className="rounded-lg bg-white p-6 text-center shadow-xl">
        <p className="text-lg font-black text-slate-950">Redirecionando para o login...</p>
      </div>
    </div>
  );
}
