import type { CreateEmailOptions } from "resend";
import { env } from "@/env";
import { Resend } from "resend";

import { HOME_DOMAIN } from "./constants";

export const resend = new Resend(env.RESEND_API_KEY);

export const EMAIL_FROM = {
  primary: env.EMAIL_FROM_ADDRESS || "Agentset Fallback <system@agentset.ai>",
  support: env.EMAIL_FROM_ADDRESS || "Agentset Support Fallback <support@agentset.ai>",
};

interface ResendEmailOptions extends Omit<CreateEmailOptions, "to" | "from"> {
  email: string;
  from?: string;
  variant?: "primary" | "notifications" | "marketing";
}

const VARIANT_TO_FROM_MAP = {
  primary: EMAIL_FROM.primary,
  notifications: "Agentset.ai <notifications@agentset.ai>", // TODO: change domain to mail.
  marketing: "Abdellatif from Agentset.ai <abdellatif@agentset.ai>", // TODO: change domain to ship.
};

export const sendEmail = async (opts: ResendEmailOptions) => {
  const {
    email,
    from,
    variant = "primary",
    bcc,
    replyTo,
    subject,
    text,
    react,
    scheduledAt,
  } = opts;

  return await resend.emails.send({
    to: email,
    from: from || VARIANT_TO_FROM_MAP[variant],
    bcc: bcc,
    replyTo: replyTo || EMAIL_FROM.support,
    subject,
    text,
    react,
    scheduledAt,
    ...(variant === "marketing" && {
      headers: {
        "List-Unsubscribe": `${HOME_DOMAIN}/account/settings`,
      },
    }),
  });
};
