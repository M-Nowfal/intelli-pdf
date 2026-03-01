const APP_URL: string = process.env.NEXT_PUBLIC_APP_URL!;

const DB_URI: string = process.env.MONGO_URI!;
const DB_NAME: string = process.env.DB_NAME!;

const ICON: string = "/icon0.svg";
const APP_NAME: "Intelli-PDF" = "Intelli-PDF";

const BOT: string = "/bot.png";

const SUCCESS_SOUND: string = "/sounds/success.mp3";

const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET!;

const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;

const SMTP_HOST: string = process.env.SMTP_HOST!;
const SMTP_PORT: string = process.env.SMTP_PORT!;
const SMTP_USER: string = process.env.SMTP_USER!;
const SMTP_PASS: string = process.env.SMTP_PASS!;

const REDIS_URL: string = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN: string = process.env.UPSTASH_REDIS_REST_TOKEN!;

const NODE_ENV: "production" | "development" | "test" = process.env.NODE_ENV!;

const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY!;
const GEMINI_MODEL = "gemini-2.5-flash";

const COST: number = 20;

const CLOUDINARY_CLOUD_NAME: string = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET!;

export {
  APP_URL,
  DB_URI, DB_NAME,
  ICON, APP_NAME,
  BOT,
  SUCCESS_SOUND,
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
  REDIS_URL, REDIS_TOKEN,
  NODE_ENV,
  GOOGLE_API_KEY, GEMINI_MODEL,
  COST,
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
};
