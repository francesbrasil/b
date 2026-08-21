/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
  const nome = e.record.get("nome") || "";
  const email = e.record.get("email") || "";
  const instagram = e.record.get("instagram") || "";
  const mensagem = e.record.get("mensagem") || "";

  const subject = "Nova solicitação de diagnóstico — Inbre";
  const html = `
    <h2>Nova solicitação de diagnóstico</h2>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Instagram:</strong> ${instagram}</p>
    <p><strong>Contexto:</strong> ${mensagem || "(não informado)"}</p>
  `;

  const message = new MailerMessage({
    from: { name: "Inbre — Diagnóstico" },
    to: [{ address: "contato@inbre.com.br" }],
    subject,
    html,
  });

  try {
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error(
      "diagnostico notification email failed",
      "to", "contato@inbre.com.br",
      "err", String(err),
    );
  }

  e.next();
}, "diagnosticos");
