import { createClient } from "npm:@supabase/supabase-js@2";

type AdminAction = "create_draft" | "update_draft" | "send" | "create_revision" | "decline";

type UpdateDraftInput = {
    proposalId: string;
    clientName: string;
    businessName: string;
    title: string;
    objective: string;
    proposedSolution: string;
    scope: string[];
    deliverables: string[];
    included: string[];
    excluded: string[];
    priceAmount: number | null;
    currency: "ARS" | "USD";
    paymentTerms: string;
    depositAmount: number | null;
    balanceAmount: number | null;
    estimatedTimeline: string;
    revisionCount: number | null;
    validUntil: string | null;
    conditions: string;
    nextStep: string;
};

type ProposalEmailNotification = {
    attempted: boolean;
    sent: boolean;
    reason?: "configuration_unavailable" | "recipient_unavailable" | "proposal_unavailable" | "delivery_failed";
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_ESCAPE_MAP: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
};
const ALLOWED_ACTIONS = new Set<AdminAction>([
    "create_draft",
    "update_draft",
    "send",
    "create_revision",
    "decline"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isUuid(value: unknown): value is string {
    return typeof value === "string" && UUID_PATTERN.test(value);
}

function nonEmptyText(value: unknown, maxLength: number): string | null {
    if (typeof value !== "string") return null;
    const normalized = value.trim();
    return normalized.length > 0 && normalized.length <= maxLength ? normalized : null;
}

function text(value: unknown, maxLength: number): string | null {
    if (typeof value !== "string") return null;
    return value.length <= maxLength ? value.trim() : null;
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, character => HTML_ESCAPE_MAP[character]);
}

function emailGreetingName(value: unknown): string {
    return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 160
        ? value.trim()
        : "";
}

function proposalEmailHtml(name: string, proposalUrl: URL): string {
    const greeting = name ? `Hola, ${escapeHtml(name)}.` : "Hola.";
    const link = escapeHtml(proposalUrl.toString());

    return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f4f1f7;color:#25222a;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f4f1f7;font-size:1px;line-height:1px;opacity:0;mso-hide:all;">Preparamos tu propuesta de NODO. Ya podés revisarla.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f1f7;">
      <tr>
        <td align="center" style="padding:32px 16px 40px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2ddea;border-radius:16px;overflow:hidden;">
            <tr><td style="height:4px;background:#805be0;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr>
              <td style="padding:24px 32px;background:#fbfaff;border-bottom:1px solid #e8e2f0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="42" valign="middle" style="width:42px;padding:0 12px 0 0;"><img src="cid:nodo-logo" width="34" alt="NODO" border="0" style="display:block;width:34px;height:auto;border:0;outline:none;text-decoration:none;"></td>
                    <td valign="middle" style="padding:0;color:#25222a;font-size:18px;font-weight:800;letter-spacing:0.13em;line-height:1;">NODO</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 30px;">
                <h1 style="margin:0 0 16px;color:#25222a;font-size:28px;line-height:1.3;font-weight:700;">${greeting}</h1>
                <p style="margin:0 0 18px;color:#504a58;font-size:16px;line-height:1.65;">Preparamos la propuesta para tu proyecto.</p>
                <p style="margin:0 0 12px;color:#504a58;font-size:16px;line-height:1.65;">Ahí vas a encontrar:</p>
                <ul style="margin:0 0 26px;padding:0 0 0 21px;color:#504a58;font-size:16px;line-height:1.7;">
                  <li>qué proponemos;</li>
                  <li>qué incluye;</li>
                  <li>la inversión y la forma de pago;</li>
                  <li>los próximos pasos.</li>
                </ul>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr><td style="border-radius:8px;background:#805be0;"><a href="${link}" style="display:inline-block;padding:13px 20px;color:#ffffff;font-size:15px;font-weight:700;line-height:1;text-decoration:none;">Ver propuesta</a></td></tr>
                </table>
                <p style="margin:28px 0 0;color:#504a58;font-size:15px;line-height:1.65;">Si querés conversar algún detalle antes de avanzar, escribinos.</p>
              </td>
            </tr>
            <tr><td style="padding:22px 32px 26px;background:#fbfaff;border-top:1px solid #eee9f4;"><p style="margin:0;color:#6e6875;font-size:14px;line-height:1.6;">NODO<br>Soluciones digitales de forma clara.</p></td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function proposalEmailText(name: string, proposalUrl: URL): string {
    return [
        name ? `Hola, ${name}.` : "Hola.",
        "",
        "Preparamos la propuesta para tu proyecto.",
        "",
        "Ahí vas a encontrar qué proponemos, qué incluye, la inversión, la forma de pago y los próximos pasos.",
        "",
        `Ver propuesta: ${proposalUrl.toString()}`,
        "",
        "Si querés conversar algún detalle antes de avanzar, escribinos.",
        "",
        "NODO",
        "Soluciones digitales de forma clara."
    ].join("\n");
}

function stringArray(value: unknown): string[] | null {
    if (!Array.isArray(value) || value.length > 100) return null;
    const values = value.map(item => typeof item === "string" ? item.trim() : null);
    return values.every(item => item !== null && item.length > 0 && item.length <= 1000)
        ? values as string[]
        : null;
}

function nullableNumber(value: unknown): number | null | undefined {
    if (value === null) return null;
    return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function nullableRevisionCount(value: unknown): number | null | undefined {
    if (value === null) return null;
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

function nullableTimestamp(value: unknown): string | null | undefined {
    if (value === null) return null;
    if (typeof value !== "string" || value.length > 120) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function configuredPublishableKey(): string | null {
    const directKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim()
        || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")?.trim();
    if (directKey) return directKey;

    try {
        const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}") as Record<string, unknown>;
        return typeof keys.default === "string" && keys.default.trim() ? keys.default.trim() : null;
    } catch {
        return null;
    }
}

function configuredSiteUrl(): URL | null {
    const value = Deno.env.get("NODO_SITE_URL")?.trim();
    if (!value) return null;

    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

function allowedOrigin(origin: string | null, siteUrl: URL | null): string | null {
    if (!origin) return null;

    try {
        const requestOrigin = new URL(origin);
        const isLocalDevelopment = requestOrigin.protocol === "http:"
            && (requestOrigin.hostname === "localhost" || requestOrigin.hostname === "127.0.0.1");

        if (isLocalDevelopment || requestOrigin.origin === siteUrl?.origin) return requestOrigin.origin;
    } catch {
        // An invalid origin does not receive CORS headers.
    }

    return null;
}

function headers(origin: string | null): Headers {
    const responseHeaders = new Headers({
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "Vary": "Origin"
    });

    if (origin) {
        responseHeaders.set("Access-Control-Allow-Origin", origin);
        responseHeaders.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        responseHeaders.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
        responseHeaders.set("Access-Control-Max-Age", "86400");
    }

    return responseHeaders;
}

function json(body: Record<string, unknown>, status: number, origin: string | null): Response {
    return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}

function accessToken(request: Request): string | null {
    const authorization = request.headers.get("Authorization");
    if (!authorization) return null;
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    return match?.[1]?.trim() || null;
}

function parseUpdateDraft(body: Record<string, unknown>): UpdateDraftInput | null {
    if (!isUuid(body.proposalId) || !isRecord(body.proposal)) return null;
    const proposal = body.proposal;

    const clientName = nonEmptyText(proposal.clientName, 160);
    const businessName = nonEmptyText(proposal.businessName, 160);
    const title = text(proposal.title, 240);
    const objective = text(proposal.objective, 12000);
    const proposedSolution = text(proposal.proposedSolution, 12000);
    const scope = stringArray(proposal.scope);
    const deliverables = stringArray(proposal.deliverables);
    const included = stringArray(proposal.included);
    const excluded = stringArray(proposal.excluded);
    const priceAmount = nullableNumber(proposal.priceAmount);
    const paymentTerms = text(proposal.paymentTerms, 12000);
    const depositAmount = nullableNumber(proposal.depositAmount);
    const balanceAmount = nullableNumber(proposal.balanceAmount);
    const estimatedTimeline = text(proposal.estimatedTimeline, 600);
    const revisionCount = nullableRevisionCount(proposal.revisionCount);
    const validUntil = nullableTimestamp(proposal.validUntil);
    const conditions = text(proposal.conditions, 12000);
    const nextStep = text(proposal.nextStep, 3000);
    const currency = typeof proposal.currency === "string" ? proposal.currency.toUpperCase() : "";

    if (!clientName || !businessName || title === null || objective === null || proposedSolution === null
        || !scope || !deliverables || !included || !excluded || priceAmount === undefined
        || (currency !== "ARS" && currency !== "USD") || paymentTerms === null
        || depositAmount === undefined || balanceAmount === undefined || estimatedTimeline === null
        || revisionCount === undefined || validUntil === undefined || conditions === null || nextStep === null) {
        return null;
    }

    return {
        proposalId: body.proposalId,
        clientName,
        businessName,
        title,
        objective,
        proposedSolution,
        scope,
        deliverables,
        included,
        excluded,
        priceAmount,
        currency,
        paymentTerms,
        depositAmount,
        balanceAmount,
        estimatedTimeline,
        revisionCount,
        validUntil,
        conditions,
        nextStep
    };
}

async function callAction(
    action: AdminAction,
    body: Record<string, unknown>,
    actorUserId: string,
    serverClient: ReturnType<typeof createClient>
) {
    if (action === "create_draft") {
        if (!isUuid(body.leadId)) return { invalid: true };
        return serverClient.rpc("edge_create_proposal_draft", {
            p_actor_user_id: actorUserId,
            p_lead_id: body.leadId
        });
    }

    if (action === "update_draft") {
        const input = parseUpdateDraft(body);
        if (!input) return { invalid: true };
        return serverClient.rpc("edge_update_proposal_draft", {
            p_actor_user_id: actorUserId,
            p_proposal_id: input.proposalId,
            p_client_name: input.clientName,
            p_business_name: input.businessName,
            p_title: input.title,
            p_objective: input.objective,
            p_proposed_solution: input.proposedSolution,
            p_scope: input.scope,
            p_deliverables: input.deliverables,
            p_included: input.included,
            p_excluded: input.excluded,
            p_price_amount: input.priceAmount,
            p_currency: input.currency,
            p_payment_terms: input.paymentTerms,
            p_deposit_amount: input.depositAmount,
            p_balance_amount: input.balanceAmount,
            p_estimated_timeline: input.estimatedTimeline,
            p_revision_count: input.revisionCount,
            p_valid_until: input.validUntil,
            p_conditions: input.conditions,
            p_next_step: input.nextStep
        });
    }

    if (!isUuid(body.proposalId)) return { invalid: true };

    switch (action) {
        case "send":
            return serverClient.rpc("edge_send_proposal", {
                p_actor_user_id: actorUserId,
                p_proposal_id: body.proposalId
            });
        case "create_revision":
            return serverClient.rpc("edge_create_proposal_revision", {
                p_actor_user_id: actorUserId,
                p_proposal_id: body.proposalId
            });
        case "decline":
            return serverClient.rpc("edge_decline_proposal", {
                p_actor_user_id: actorUserId,
                p_proposal_id: body.proposalId
            });
        default:
            return { invalid: true };
    }
}

async function sendProposalReadyEmail(
    serverClient: ReturnType<typeof createClient>,
    proposalId: string,
    nodoSiteUrl: URL | null
): Promise<ProposalEmailNotification> {
    try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")?.trim();
    const emailFrom = Deno.env.get("NODO_EMAIL_FROM")?.trim();
    if (!resendApiKey || !emailFrom || !nodoSiteUrl) {
        console.warn("proposal-admin email notification unavailable", { proposalId, reason: "configuration_unavailable" });
        return { attempted: false, sent: false, reason: "configuration_unavailable" };
    }

    const { data: proposalData, error: proposalError } = await serverClient
        .from("proposals")
        .select("id, lead_id, status, public_token, client_name")
        .eq("id", proposalId)
        .maybeSingle();

    if (proposalError || !isRecord(proposalData) || proposalData.status !== "sent"
        || typeof proposalData.lead_id !== "string" || typeof proposalData.public_token !== "string") {
        console.warn("proposal-admin email notification unavailable", { proposalId, reason: "proposal_unavailable" });
        return { attempted: false, sent: false, reason: "proposal_unavailable" };
    }

    const { data: leadData, error: leadError } = await serverClient
        .from("leads")
        .select("email, name")
        .eq("id", proposalData.lead_id)
        .maybeSingle();

    const recipient = isRecord(leadData) && typeof leadData.email === "string"
        ? leadData.email.trim().toLowerCase()
        : "";
    if (leadError || !EMAIL_PATTERN.test(recipient)) {
        console.warn("proposal-admin email notification unavailable", { proposalId, reason: "recipient_unavailable" });
        return { attempted: false, sent: false, reason: "recipient_unavailable" };
    }

    const proposalUrl = new URL("propuesta.html", nodoSiteUrl);
    proposalUrl.searchParams.set("t", proposalData.public_token);
    const logoUrl = new URL("assets/logo.png", nodoSiteUrl);
    const recipientName = emailGreetingName(proposalData.client_name) || emailGreetingName(leadData.name);

    try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
                "User-Agent": "nodo-proposal-notification/1.0"
            },
            body: JSON.stringify({
                from: emailFrom,
                to: [recipient],
                subject: recipientName ? `${recipientName}, tu propuesta de NODO está lista` : "Preparamos tu propuesta | NODO",
                html: proposalEmailHtml(recipientName, proposalUrl),
                text: proposalEmailText(recipientName, proposalUrl),
                attachments: [
                    {
                        path: logoUrl.toString(),
                        filename: "nodo-logo.png",
                        contentId: "nodo-logo"
                    }
                ]
            })
        });

        if (!resendResponse.ok) {
            console.warn("proposal-admin email delivery failed", { proposalId, status: resendResponse.status });
            return { attempted: true, sent: false, reason: "delivery_failed" };
        }
    } catch {
        console.warn("proposal-admin email delivery failed", { proposalId, reason: "delivery_failed" });
        return { attempted: true, sent: false, reason: "delivery_failed" };
    }

    console.info("proposal-admin email delivered", { proposalId });
    return { attempted: true, sent: true };
    } catch {
        // La propuesta ya fue enviada: una falla secundaria de notificación nunca revierte esa transición.
        console.warn("proposal-admin email notification failed", { proposalId, reason: "delivery_failed" });
        return { attempted: false, sent: false, reason: "delivery_failed" };
    }
}

Deno.serve(async (request: Request) => {
    const siteUrl = configuredSiteUrl();
    const origin = allowedOrigin(request.headers.get("Origin"), siteUrl);

    try {
        if (request.headers.has("Origin") && !origin) {
            return json({ ok: false, error: "origin_not_allowed" }, 403, null);
        }

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: headers(origin) });
        }

        if (request.method !== "POST") {
            return json({ ok: false, error: "method_not_allowed" }, 405, origin);
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
        const publishableKey = configuredPublishableKey();
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
        const token = accessToken(request);

        if (!token) return json({ ok: false, error: "authentication_required" }, 401, origin);
        if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
            return json({ ok: false, error: "server_configuration_error" }, 500, origin);
        }

        const authenticatedClient = createClient(supabaseUrl, publishableKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${token}` } }
        });

        const { data: userData, error: userError } = await authenticatedClient.auth.getUser(token);
        if (userError || !userData.user) {
            return json({ ok: false, error: "authentication_required" }, 401, origin);
        }

        const actorUserId = userData.user.id;
        const { data: membership, error: membershipError } = await authenticatedClient
            .from("admin_users")
            .select("user_id")
            .eq("user_id", actorUserId)
            .maybeSingle();

        if (membershipError) {
            console.error("proposal-admin membership verification failed");
            return json({ ok: false, error: "authorization_check_failed" }, 500, origin);
        }

        if (!membership) return json({ ok: false, error: "admin_required" }, 403, origin);

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return json({ ok: false, error: "invalid_payload" }, 400, origin);
        }

        if (!isRecord(body)
            || "actorUserId" in body
            || "actor_user_id" in body
            || typeof body.action !== "string"
            || !ALLOWED_ACTIONS.has(body.action as AdminAction)) {
            return json({ ok: false, error: "invalid_payload" }, 400, origin);
        }

        const serverClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        const result = await callAction(body.action as AdminAction, body, actorUserId, serverClient);
        if ("invalid" in result) return json({ ok: false, error: "invalid_payload" }, 400, origin);

        if (result.error) {
            console.error("proposal-admin action failed", { action: body.action });
            return json({ ok: false, error: "proposal_action_failed" }, 500, origin);
        }

        const notification = body.action === "send"
            ? await sendProposalReadyEmail(serverClient, body.proposalId as string, siteUrl)
            : undefined;
        return json({ ok: true, data: result.data, notification }, 200, origin);
    } catch {
        console.error("proposal-admin unexpected failure");
        return json({ ok: false, error: "server_error" }, 500, origin);
    }
});
