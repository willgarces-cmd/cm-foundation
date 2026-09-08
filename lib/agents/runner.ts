import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

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
 *
 * Los clientes se crean DENTRO de la función (no a nivel de módulo) a propósito:
 * si se crean al importar el archivo, Next.js falla al construir el proyecto
 * cuando las variables de entorno todavía no están configuradas en Vercel.
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anthropicKey) {
    return {
      error:
        "Faltan variables de entorno (ANTHROPIC_API_KEY y/o SUPABASE_SERVICE_ROLE_KEY) en Vercel.",
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  const anthropic = new Anthropic({ apiKey: anthropicKey });

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
