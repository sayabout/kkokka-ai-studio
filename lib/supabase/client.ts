import { createBrowserClient } from "@supabase/ssr";

// 2단계에서 사용. .env.local 에 키를 넣으면 연결됩니다.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
