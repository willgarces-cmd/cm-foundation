import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// Cliente de servicio: usa la service_role key (nunca la anon key).
// Este archivo SOLO se importa desde rutas /api (servidor), nunca desde
// componentes de cliente — la service_role key no debe llegar al navegador.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type RunAgentParams = {
  agentName: string;
  vertical: string;
  systemPrompt: string;
  userPrompt: string;
  model?: string;
};

/**
 * Ejecuta un agente: llama a la API de Claude y registra la decisión
 * en `agent_logs`, sin importar el resultado (éxito o error).
 * Reutilizable por cualquier agente de cualquier desafío del ecosistema CM.
 */
export async function runAgent({
  agentName,
  vertical,
  systemPrompt,
  userPrompt,
  model = "claude-sonnet-4-6",
}: RunAgentParams) {
  let output: Record<string, unknown> = {};
  let status = "ok";

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    output = { text: textBlock && "text" in textBlock ? textBlock.text : null };
  } catch (err: any) {
    status = "error";
    output = { error: err?.message ?? "Error desconocido al llamar al agente." };
  }

  await supabaseAdmin.from("agent_logs").insert({
    agent_name: agentName,
    vertical,
    input: { prompt: userPrompt },
    output,
    status,
  });

  return output;
}
