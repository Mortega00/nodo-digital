import { createClient } from "npm:@supabase/supabase-js@2";

const TOKEN_PATTERN = /^[0-9a-f]{64}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

Deno.serve(async (request: Request) => {
    const siteUrl = configuredSiteUrl();
    const origin = allowedOrigin(request.headers.get("Origin"), siteUrl);

    if (request.headers.has("Origin") && !origin) {
        return json({ ok: false, error: "origin_not_allowed" }, 403, null);
    }

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headers(origin) });
    }

    if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }

    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return json({ ok: false, error: "invalid_payload" }, 400, origin);
        }

        const token = isRecord(body) && typeof body.token === "string" ? body.token.trim() : "";
        if (!TOKEN_PATTERN.test(token)) {
            return json({ ok: false, error: "invalid_token" }, 400, origin);
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
        if (!supabaseUrl || !serviceRoleKey) {
            return json({ ok: false, error: "server_configuration_error" }, 500, origin);
        }

        const serverClient = createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        const { data, error } = await serverClient.rpc("edge_accept_public_proposal", {
            p_public_token: token
        });

        if (error || !isRecord(data)) {
            console.error("accept-public-proposal RPC failed");
            return json({ ok: false, error: "proposal_acceptance_failed" }, 500, origin);
        }

        if (data.reason === "expired") {
            return json({ ok: false, error: "proposal_expired" }, 409, origin);
        }

        if (data.available === false || data.ok === false) {
            return json({ ok: false, error: "proposal_unavailable" }, 404, origin);
        }

        return json({ ok: true, data }, 200, origin);
    } catch {
        console.error("accept-public-proposal unexpected failure");
        return json({ ok: false, error: "server_error" }, 500, origin);
    }
});
