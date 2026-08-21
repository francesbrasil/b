// Mercado Pago Checkout Pro — creates a checkout preference and returns the
// sandbox/init URL the browser should redirect to. The access token is a
// user-supplied secret kept in apps/api/.env; it never reaches the browser.
import {
  isIntegrationConfigured,
  respondNotConfigured,
} from "../utils/integrationConfig.js";

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

// Canonical plan catalog (single source of truth for the backend). Prices in
// BRL. The frontend only sends a `plan` id — never a price — so a client
// cannot tamper with the amount charged.
const PLANS = {
  essencial: {
    id: "plan-essencial",
    title: "Plano Essencial — Inbre",
    description: "10 vídeos de Reels por mês",
    unitPrice: 897.9,
  },
  constante: {
    id: "plan-constante",
    title: "Plano Constante — Inbre",
    description: "15 vídeos de Reels por mês",
    unitPrice: 1273.9,
  },
  "alto-volume": {
    id: "plan-alto-volume",
    title: "Plano Alto Volume — Inbre",
    description: "25 vídeos de Reels por mês",
    unitPrice: 1949.9,
  },
};

export async function createCheckout(req, res) {
  const { plan } = (req.body ?? {});

  if (!plan || !PLANS[plan]) {
    return res.status(422).json({
      error: "invalid_plan",
      message: "Informe um plano válido: essencial, constante ou alto-volume.",
    });
  }

  if (!isIntegrationConfigured("MERCADOPAGO_ACCESS_TOKEN")) {
    return respondNotConfigured(res, {
      integration: "Mercado Pago",
      envKeys: "MERCADOPAGO_ACCESS_TOKEN",
    });
  }

  const selected = PLANS[plan];

  // Build absolute back_urls from the request origin so the redirect returns
  // to the same site the buyer came from.
  const origin =
    req.headers.origin ||
    (req.protocol && req.get("host")
      ? `${req.protocol}://${req.get("host")}`
      : "https://inbre.com.br");

  const preference = {
    items: [
      {
        id: selected.id,
        title: selected.title,
        description: selected.description,
        quantity: 1,
        currency_id: "BRL",
        unit_price: selected.unitPrice,
      },
    ],
    back_urls: {
      success: `${origin}/`,
      pending: `${origin}/`,
      failure: `${origin}/`,
    },
    auto_return: "approved",
    statement_descriptor: "Inbre",
    external_reference: selected.id,
    metadata: { plan },
  };

  const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preference),
  });

  if (!mpRes.ok) {
    const body = await mpRes.text().catch(() => "");
    throw new Error(
      `mercadopago create preference failed: ${mpRes.status} ${mpRes.statusText} ${body}`,
    );
  }

  const data = await mpRes.json();

  // With a TEST token the sandbox URL is the correct checkout endpoint for
  // test-mode payments. Fall back to init_point if absent.
  const checkoutUrl = data.sandbox_init_point || data.init_point;

  if (!checkoutUrl) {
    throw new Error(
      `mercadopago response missing checkout url: ${mpRes.status} ${mpRes.statusText}`,
    );
  }

  res.json({
    plan,
    checkoutUrl,
    preferenceId: data.id,
    sandbox: Boolean(data.sandbox_init_point),
  });
}

export default createCheckout;
