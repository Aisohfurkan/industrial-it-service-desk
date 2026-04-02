-- ######################################################
-- # INDUSTRIAL IT SUPPORT SYSTEM - DATABASE SCHEMA
-- ######################################################

-- Bu kodlar Supabase SQL Editor üzerinde çalıştırılmalıdır.

-- 1. PROFILES TABLOSU (Kullanıcı Rolleri)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT CHECK (role IN ('musteri', 'destek', 'admin')) DEFAULT 'musteri',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TICKETS TABLOSU (Destek Talepleri)
CREATE TABLE public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('acik', 'beklemede', 'cozuldu')) DEFAULT 'acik',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. COMMENTS TABLOSU (Mesajlaşma)
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. OTOMATİK PROFİL OLUŞTURUCU (Trigger)
-- Yeni bir kullanıcı kayıt olduğunda otomatik olarak profiles tablosuna 'musteri' rolüyle ekler.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'musteri');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS) POLİTİKALARI
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: Herkes kendi profilini görebilir
CREATE POLICY "Kendi profilini gör" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Tickets: Müşteri kendi, admin her şeyi görür
CREATE POLICY "Biletleri görme yetkisi" ON public.tickets FOR SELECT USING (
  customer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Bilet oluşturma" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Bilet güncelleme (Admin)" ON public.tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments: Biletle ilgisi olanlar mesajları görebilir
CREATE POLICY "Mesaj görme" ON public.comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = comments.ticket_id AND 
    (tickets.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

CREATE POLICY "Mesaj yazma" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);