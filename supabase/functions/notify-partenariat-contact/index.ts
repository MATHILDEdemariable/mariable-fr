const RESEND_API_KEY = Deno.env.get("RESEND");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escape = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND key missing");
    }

    const { email, phone, message, subject } = await req.json();

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "email et message requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subj = subject?.trim()
      ? `Nouvelle demande Partenariat — ${subject}`
      : "Nouvelle demande Partenariat";

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background:#fff; padding:32px; color:#1a1a1a;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; color:#7F9474; margin:0 0 16px;">Nouvelle demande Partenariat</h2>
        ${subject ? `<p style="margin:0 0 8px;"><strong>Sujet :</strong> ${escape(subject)}</p>` : ""}
        <p style="margin:0 0 8px;"><strong>Email :</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>
        ${phone ? `<p style="margin:0 0 8px;"><strong>Téléphone :</strong> ${escape(phone)}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
        <p style="white-space:pre-wrap; line-height:1.6;">${escape(message)}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mariable <mathilde@mariable.fr>",
        to: ["mathilde@mariable.fr"],
        reply_to: email,
        subject: subj,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-partenariat-contact error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
