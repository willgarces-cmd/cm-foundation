import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agents/runner";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const mensaje = body.mensaje ?? "Preséntate en una frase como agente de prueba del foundation CM.";

  const output = await runAgent({
    agentName: "ping",
    vertical: "core",
    systemPrompt: "Eres un agente de prueba de infraestructura. Responde en una sola frase, en español.",
    userPrompt: mensaje,
  });

  return NextResponse.json({ output });
}
