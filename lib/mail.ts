import nodemailer, { type SendMailOptions } from "nodemailer";
import {
  orderConfirmationTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
} from "@/helper/EmailTemplate";

type MailApp = "admin" | "website";

type OrderMailProduct = {
  name: string;
  price: number;
  quantity: number;
};

const MAIL_APP_CONFIG: Record<
  MailApp,
  {
    displayName: string;
    resetSubject: string;
    envKeys: string[];
    fallbackUrl: string;
  }
> = {
  admin: {
    displayName: "Admin Panel",
    resetSubject: "Password Reset - Admin Panel",
    envKeys: ["ADMIN_APP_URL", "NEXT_PUBLIC_ADMIN_URL"],
    fallbackUrl: "http://localhost:3001",
  },
  website: {
    displayName: "Student Note Books",
    resetSubject: "Password Reset - Student Note Books",
    envKeys: ["WEBSITE_URL", "NEXT_PUBLIC_WEBSITE_URL"],
    fallbackUrl: "http://localhost:3000",
  },
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getRequiredEnv = (key: "NODEMAILER_USER" | "NODEMAILER_PASS") => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getBaseUrl = (app: MailApp) => {
  const config = MAIL_APP_CONFIG[app];
  const value = config.envKeys
    .map((key) => process.env[key]?.trim())
    .find(Boolean);

  return trimTrailingSlash(value || config.fallbackUrl);
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: getRequiredEnv("NODEMAILER_USER"),
        pass: getRequiredEnv("NODEMAILER_PASS"),
      },
    });
  }

  return transporter;
};

const sendMail = async (mailOptions: SendMailOptions) => {
  await getTransporter().sendMail(mailOptions);
};

const getFromAddress = (displayName: string) =>
  `${displayName} <${getRequiredEnv("NODEMAILER_USER")}>`;

export const sendPasswordResetEmail = async ({
  app,
  to,
  name,
  resetToken,
  baseUrl,
}: {
  app: MailApp;
  to: string;
  name: string;
  resetToken: string;
  baseUrl?: string;
}) => {
  const config = MAIL_APP_CONFIG[app];
  const resolvedBaseUrl = trimTrailingSlash(baseUrl || getBaseUrl(app));

  await sendMail({
    from: getFromAddress(config.displayName),
    to,
    subject: config.resetSubject,
    html: passwordResetTemplate({
      name,
      appName: config.displayName,
      homeUrl: resolvedBaseUrl,
      resetUrl: `${resolvedBaseUrl}/verify-token/${resetToken}`,
    }),
  });
};

export const sendWelcomeEmail = async ({
  to,
  name,
}: {
  to: string;
  name: string;
}) => {
  const websiteUrl = getBaseUrl("website");

  await sendMail({
    from: getFromAddress(MAIL_APP_CONFIG.website.displayName),
    to,
    subject: "Welcome to Student Note Books!",
    html: welcomeEmailTemplate(name, websiteUrl),
  });
};

export const sendOrderConfirmationEmail = async ({
  to,
  name,
  orderId,
  products,
  total,
}: {
  to: string;
  name: string;
  orderId: string;
  products: OrderMailProduct[];
  total: number;
}) => {
  await sendMail({
    from: getFromAddress(MAIL_APP_CONFIG.website.displayName),
    to,
    subject: "Order Confirmed - Student Note Books",
    html: orderConfirmationTemplate(name, orderId, products, total),
  });
};
