type PlanKey = "launch" | "positioning" | "conversion" | "presence" | "local" | "custom";

type ConfirmationInput = {
    name: string;
    email: string;
    businessName: string | null;
    planName: string;
    planPrice: string;
    planKey: PlanKey;
};

const PLAN_NAMES: Record<Exclude<PlanKey, "custom">, string> = {
    launch: "NODO Lanzamiento",
    positioning: "NODO Posicionamiento",
    conversion: "NODO Conversión",
    presence: "Presencia",
    local: "Local"
};

const CURRENT_PLAN_PRICES = {
    presence: "$180.000 ARS",
    local: "$280.000 ARS"
} as const;

const CUSTOM_PLAN_DETAILS = {
    "NODO Personalizado": "Presupuesto a medida",
    Personalizado: "Presupuesto a medida"
} as const;

const NODO_LOGO_URL = "https://nododigital.com.ar/assets/logo.png";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_ESCAPE_MAP: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
};

function isText(value: unknown, maxLength: number): value is string {
    return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, character => HTML_ESCAPE_MAP[character]);
}

function siteUrl(): URL | null {
    const value = Deno.env.get("NODO_SITE_URL")?.trim();
    if (!value) return null;

    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

function allowedOrigin(origin: string | null, configuredSiteUrl: URL | null): string | null {
    if (!origin) return null;

    try {
        const requestOrigin = new URL(origin);
        const isLocalDevelopment = requestOrigin.protocol === "http:"
            && (requestOrigin.hostname === "localhost" || requestOrigin.hostname === "127.0.0.1");

        if (isLocalDevelopment || configuredSiteUrl?.origin === requestOrigin.origin) return requestOrigin.origin;
    } catch {
        // Un origen inválido no recibe encabezados CORS.
    }

    return null;
}

function corsHeaders(origin: string | null): Headers {
    const headers = new Headers({
        "Content-Type": "application/json; charset=utf-8",
        "Vary": "Origin"
    });

    if (origin) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
        headers.set("Access-Control-Max-Age", "86400");
    }

    return headers;
}

function json(body: Record<string, unknown>, status: number, origin: string | null): Response {
    return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function parseInput(value: unknown): ConfirmationInput | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const input = value as Record<string, unknown>;

    if (!isText(input.name, 120) || !isText(input.email, 254) || !EMAIL_PATTERN.test(input.email.trim())) return null;
    if (!isText(input.planKey, 32)) return null;
    if (!isText(input.planName, 80) || !isText(input.planPrice, 120)) return null;
    if (input.businessName !== null && input.businessName !== undefined && !isText(input.businessName, 160)) return null;

    const planKey = input.planKey as PlanKey;
    const planName = input.planName.trim();
    const planPrice = input.planPrice.trim();
    let normalizedPlanName: string;
    let normalizedPlanPrice: string;

    if (planKey === "custom") {
        if (!(planName in CUSTOM_PLAN_DETAILS)) return null;
        normalizedPlanName = planName;
        normalizedPlanPrice = CUSTOM_PLAN_DETAILS[planName as keyof typeof CUSTOM_PLAN_DETAILS];
    } else {
        if (!(planKey in PLAN_NAMES) || planName !== PLAN_NAMES[planKey]) return null;
        normalizedPlanName = PLAN_NAMES[planKey];
        normalizedPlanPrice = planKey === "presence" || planKey === "local"
            ? CURRENT_PLAN_PRICES[planKey]
            : planPrice;
    }

    return {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        businessName: typeof input.businessName === "string" ? input.businessName.trim() : null,
        planName: normalizedPlanName,
        planPrice: normalizedPlanPrice,
        planKey
    };
}

function confirmationHtml(input: ConfirmationInput, nodoSiteUrl: URL): string {
    const name = escapeHtml(input.name);
    const planName = escapeHtml(input.planName);
    const planPrice = escapeHtml(input.planPrice);
    const visitUrl = escapeHtml(nodoSiteUrl.toString());

    return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f4f1f7;color:#25222a;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f4f1f7;font-size:1px;line-height:1px;opacity:0;mso-hide:all;">Recibimos tu consulta y ya estamos revisando tu proyecto.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f1f7;">
      <tr>
        <td align="center" style="padding:32px 16px 40px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2ddea;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:#805be0;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background:#fbfaff;border-bottom:1px solid #e8e2f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="42" valign="middle" style="width:42px;padding:0 12px 0 0;">
                      <img src="cid:nodo-logo" width="34" alt="NODO" border="0" style="display:block;width:34px;height:auto;border:0;outline:none;text-decoration:none;">
                    </td>
                    <td valign="middle" style="padding:0;color:#25222a;font-size:18px;font-weight:800;letter-spacing:0.13em;line-height:1;">NODO</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 30px;">
                <h1 style="margin:0 0 16px;color:#25222a;font-size:28px;line-height:1.3;font-weight:700;">Hola, ${name}.</h1>
                <p style="margin:0 0 10px;color:#504a58;font-size:16px;line-height:1.65;">Ya recibimos la información inicial de tu proyecto.</p>
                <p style="margin:0 0 18px;color:#504a58;font-size:16px;line-height:1.65;">Por lo que nos contaste, el punto de partida que encontramos es:</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 0 20px;background:#f7f3fc;border:1px solid #ded3ef;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <p style="margin:0 0 8px;color:#805be0;font-size:11px;font-weight:800;letter-spacing:0.1em;line-height:1.3;">TU PUNTO DE PARTIDA</p>
                      <p style="margin:0 0 6px;color:#25222a;font-size:19px;line-height:1.4;font-weight:700;">${planName}</p>
                      <p style="margin:0;color:#805be0;font-size:16px;line-height:1.45;font-weight:700;">${planPrice}</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 28px;color:#504a58;font-size:15px;line-height:1.65;">Es una orientación inicial. Vamos a revisar tu caso antes de confirmar alcance, valor y tiempos.</p>
                <h2 style="margin:0 0 12px;color:#25222a;font-size:20px;line-height:1.35;">¿Qué sigue?</h2>
                <ol style="margin:0 0 28px;padding:0 0 0 22px;color:#504a58;font-size:16px;line-height:1.75;">
                  <li>Revisamos tu consulta.</li>
                  <li>Confirmamos el alcance.</li>
                  <li>Te enviamos una propuesta.</li>
                  <li>Si decidís avanzar, coordinamos el inicio.</li>
                </ol>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:8px;background:#805be0;">
                      <a href="${visitUrl}" style="display:inline-block;padding:13px 20px;color:#ffffff;font-size:15px;font-weight:700;line-height:1;text-decoration:none;">Volver a NODO</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 26px;background:#fbfaff;border-top:1px solid #eee9f4;">
                <p style="margin:0;color:#6e6875;font-size:14px;line-height:1.6;">NODO<br>Soluciones digitales de forma clara.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function confirmationText(input: ConfirmationInput, nodoSiteUrl: URL): string {
    return [
        `Hola, ${input.name}.`,
        "",
        "Ya recibimos la información inicial de tu proyecto.",
        "",
        "Por lo que nos contaste, el punto de partida que encontramos es:",
        input.planName,
        input.planPrice,
        "",
        "Es una orientación inicial. Vamos a revisar tu caso antes de confirmar alcance, valor y tiempos.",
        "",
        "¿Qué sigue?",
        "1. Revisamos tu consulta.",
        "2. Confirmamos el alcance.",
        "3. Te enviamos una propuesta.",
        "4. Si decidís avanzar, coordinamos el inicio.",
        "",
        `Volver a NODO: ${nodoSiteUrl.toString()}`,
        "",
        "NODO",
        "Soluciones digitales de forma clara."
    ].join("\n");
}

Deno.serve(async (request: Request) => {
    const configuredSiteUrl = siteUrl();
    const origin = allowedOrigin(request.headers.get("Origin"), configuredSiteUrl);

    if (request.headers.has("Origin") && !origin) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, null);
    }

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return json({ ok: false, error: "invalid_payload" }, 400, origin);
    }

    const input = parseInput(body);
    if (!input) return json({ ok: false, error: "invalid_payload" }, 400, origin);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("NODO_EMAIL_FROM")?.trim();
    if (!resendApiKey || !emailFrom || !configuredSiteUrl) {
        return json({ ok: false, error: "email_delivery_failed" }, 500, origin);
    }

    try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
                "User-Agent": "nodo-lead-confirmation/1.0"
            },
            body: JSON.stringify({
                from: emailFrom,
                to: [input.email],
                subject: "Recibimos tu consulta | NODO",
                html: confirmationHtml(input, configuredSiteUrl),
                text: confirmationText(input, configuredSiteUrl),
                attachments: [
                    {
                        path: NODO_LOGO_URL,
                        filename: "nodo-logo.png",
                        contentId: "nodo-logo"
                    }
                ]
            })
        });

        if (!resendResponse.ok) {
            return json({ ok: false, error: "email_delivery_failed" }, 500, origin);
        }
    } catch {
        return json({ ok: false, error: "email_delivery_failed" }, 500, origin);
    }

    return json({ ok: true }, 200, origin);
});
