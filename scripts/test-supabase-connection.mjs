/**
 * Проверка подключения к Supabase (anon key).
 * Запуск: node scripts/test-supabase-connection.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function loadEnv() {
  const paths = [join(root, ".env.local"), join(root, ".env")];
  const merged = {};
  for (const p of paths) {
    if (!existsSync(p)) continue;
    Object.assign(merged, parseEnvFile(readFileSync(p, "utf8")));
  }
  return merged;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const key =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Не найдены VITE_SUPABASE_URL и ключ (anon) в .env.local / .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const tables = ["fighters", "fights", "news", "rankings"];

console.log("URL:", url);
console.log("Проверка SELECT (limit 1) по таблицам...\n");

let failed = false;
for (const table of tables) {
  const { data, error } = await supabase.from(table).select("*").limit(1);
  if (error) {
    console.error(`✗ ${table}:`, error.message);
    failed = true;
  } else {
    console.log(`✓ ${table}: ok (${Array.isArray(data) ? data.length : 0} row sample)`);
  }
}

if (failed) {
  console.error("\nЕсть ошибки: проверьте URL, anon key и что миграции применены в этом проекте Supabase.");
  process.exit(1);
}

console.log("\nПодключение успешно.");
