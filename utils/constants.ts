const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

const DB_URI: string = process.env.MONGO_URI!;
const DB_NAME: string = process.env.DB_NAME!;

const ICON: string = "/icon0.svg";
const APP_NAME: "Intelli-PDF" = "Intelli-PDF";

const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET!;

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;

const SMTP_HOST: string = process.env.SMTP_HOST!;
const SMTP_PORT: string = process.env.SMTP_PORT!;
const SMTP_USER: string = process.env.SMTP_USER!;
const SMTP_PASS: string = process.env.SMTP_PASS!;

const NODE_ENV: "production" | "development" | "test" = process.env.NODE_ENV!;

const CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUD_API_KEY: string = process.env.CLOUDINARY_API_KEY!;
const CLOUD_API_SECRET: string = process.env.CLOUDINARY_API_SECRET!;

const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY!;

export {
  API_URL,
  DB_URI, DB_NAME,
  ICON, APP_NAME,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  NODE_ENV,
  CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET,
  GOOGLE_API_KEY,
};
