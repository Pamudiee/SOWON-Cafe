import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      email,
      customer_name,
      workshop_name,
      day,
      time,
      guests,
      total_price,
    } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SOWON Cafe <onboarding@resend.dev>",
        to: [email],
        subject: "SOWON Cafe — Reservation Request Received",
        html: `
          <h2>Thank you for your reservation request!</h2>
          <p>Hi ${customer_name},</p>

          <p>
            We received your reservation request for
            <strong>${workshop_name}</strong>.
          </p>

          <p><strong>Day:</strong> ${day}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Total:</strong> Rs. ${total_price}</p>

          <p>We will confirm the session and availability with you soon.</p>

          <br />
          <p>SOWON Cafe & Creative Space</p>
          <p>Rajagiriya, Sri Lanka</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Unable to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});