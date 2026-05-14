import { NextRequest, NextResponse } from "next/server";

type ApiBrasilVehicle = {
  anoFabricacao?: number;
  anoModelo?: string;
  cor?: string;
  marca?: string;
  modelo?: string;
  valor?: number;
  principal?: boolean;
};

type ApiBrasilResponse = {
  error?: boolean;
  message?: string;
  data?: {
    resultados?: ApiBrasilVehicle[];
  };
};

export async function POST(request: NextRequest) {
  const token = process.env.API_BRASIL_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: true, message: "Token da API Brasil nao configurado." },
      { status: 500 },
    );
  }

  const { placa } = await request.json();
  const cleanPlate = String(placa ?? "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (cleanPlate.length < 7) {
    return NextResponse.json(
      { error: true, message: "Informe uma placa valida." },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("Timeout excedido"), 120000);

  try {
    const response = await fetch("https://gateway.apibrasil.io/api/v2/consulta/veiculos/credits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tipo: "fipe-chassi",
        placa: cleanPlate,
        homolog: true,
      }),
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const payload = (await response.json()) as ApiBrasilResponse;

    if (!response.ok || payload.error) {
      return NextResponse.json(
        { error: true, message: payload.message ?? "Nao foi possivel consultar a placa." },
        { status: response.status || 400 },
      );
    }

    const vehicle =
      payload.data?.resultados?.find((item) => item.principal) ??
      payload.data?.resultados?.[0];

    if (!vehicle) {
      return NextResponse.json(
        { error: true, message: "Nenhum veiculo encontrado para esta placa." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      error: false,
      vehicle: {
        brand: vehicle.marca ?? "",
        name: vehicle.modelo ?? "",
        color: vehicle.cor ?? "",
        year: Number(vehicle.anoModelo ?? vehicle.anoFabricacao ?? 0),
        fipe: Number(vehicle.valor ?? 0),
      },
      raw: payload,
    });
  } catch {
    clearTimeout(timeoutId);
    return NextResponse.json(
      { error: true, message: "Erro na requisicao da API Brasil." },
      { status: 500 },
    );
  }
}
