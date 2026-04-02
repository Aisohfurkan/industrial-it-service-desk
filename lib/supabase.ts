import { createClient } from '@supabase/supabase-js'

// Şifreleri artık doğrudan kod içine yazmıyoruz, sistemden çekiyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Eğer bir hata olursa konsolda görelim (Hata ayıklama için)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase anahtarları .env.local dosyasından okunamadı!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)