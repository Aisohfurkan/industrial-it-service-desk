# 🏭 Industrial IT Service Desk (v4.2.0)

Bu proje, büyük ölçekli fabrikalar ve endüstriyel tesisler için tasarlanmış, **Next.js 14**, **Tailwind CSS** ve **Supabase** tabanlı profesyonel bir Bilişim Olay Yönetim Sistemi (Incident Management System) altyapısıdır.



## 🚀 Özellikler

- **Kurumsal Kimlik Doğrulama:** Supabase Auth ile güvenli giriş ve kayıt sistemi.
- **Rol Tabanlı Erişim Kontrolü (RBAC):** `Admin` ve `Müşteri` rolleri için özelleştirilmiş dashboard deneyimi.
- **Dinamik İstatistik Paneli:** Toplam, aktif ve çözülen taleplerin gerçek zamanlı takibi.
- **Görsel Kanıt Desteği:** Supabase Storage entegrasyonu ile taleplere ekran görüntüsü/fotoğraf ekleyebilme.
- **Güvenli Mesajlaşma Hattı:** Her talep altında admin ve kullanıcı arasında izole iletişim kanalı.
- **Endüstriyel Arayüz:** Karanlık mod (Industrial Dark), Tailwind CSS ile optimize edilmiş modern UI.
- **Veri Güvenliği (RLS):** SQL seviyesinde Row Level Security politikaları ile veri sızıntısı engelleme.

## 🛠️ Teknoloji Yığını (Tech Stack)

* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
* **Backend & DB:** Supabase (PostgreSQL)
* **Storage:** Supabase Storage (Object Storage)
* **State Management:** React Hooks (useState, useEffect)

Markdown
## 📦 Kurulum ve Çalıştırma (Detaylı Rehber)

Projeyi yerel bilgisayarınızda (localhost) sorunsuz bir şekilde ayağa kaldırmak için lütfen aşağıdaki adımları sırasıyla izleyin.

### Ön Koşullar
* Bilgisayarınızda **Node.js** (v18 veya üzeri) yüklü olmalıdır.
* Ücretsiz bir [Supabase](https://supabase.com/) hesabınız olmalıdır.

---

### Adım 1: Projeyi Klonlayın ve Bağımlılıkları Yükleyin

Terminalinizi açın ve aşağıdaki komutları sırasıyla çalıştırın:


# Projeyi bilgisayarınıza indirin
git clone [https://github.com/Aisohfurkan/industrial-it-service-desk.git](https://github.com/Aisohfurkan/industrial-it-service-desk.git)

# Proje klasörüne girin
cd industrial-it-service-desk

# Gerekli kütüphaneleri yükleyin
npm install

Adım 2: Çevresel Değişkenleri (Environment Variables) Ayarlayın
Projenin veritabanı ile konuşabilmesi için Supabase bağlantı anahtarlarına ihtiyacı vardır.

Proje ana dizininde .env.example isimli bir dosya göreceksiniz.

Bu dosyanın adını .env.local olarak değiştirin (veya yeni bir .env.local dosyası oluşturun).

Supabase panelinizden Project Settings > API sekmesine gidin.

Dosyanın içini kendi bilgilerinizle doldurun:

Kod snippet'i

NEXT_PUBLIC_SUPABASE_URL=[https://senin-proje-id.supabase.co](https://senin-proje-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=senin_upuzun_anon_key_degerin

Adım 3: Veritabanı ve Tabloları Kurun (SQL)
Tabloları, ilişkileri ve güvenlik kurallarını (RLS) tek tıkla kuracağız:

Supabase panelinize gidin ve sol menüden SQL Editor'ü açın.

"New Query" butonuna basarak yeni bir sayfa açın.

Proje klasörünüzdeki /supabase/schema.sql dosyasının içindeki tüm kodları kopyalayın.

Supabase SQL Editor'e yapıştırın ve sağ alttaki "Run" (Çalıştır) butonuna basın.
(Ekranda "Success" yazısını göreceksiniz. Tablolarınız ve rolleriniz otomatik oluşturuldu!)

Adım 4: Görsel Yükleme Alanını (Storage) Ayarlayın
Kullanıcıların biletlere fotoğraf ekleyebilmesi için bir depolama alanı açmalıyız:

Supabase panelinde sol menüden Storage sekmesine tıklayın.

"New Bucket" butonuna basın.

Name kısmına tam olarak ticket-images yazın.

"Public bucket" seçeneğini KESİNLİKLE AÇIK (ON) duruma getirin (Yoksa resimler ekranda görünmez).

"Save" diyerek kaydedin.

Adım 5: Sistemi Ateşleyin! 🚀
Her şey hazır! Şimdi yerel sunucumuzu başlatabiliriz:

Bash
npm run dev

Tarayıcınızı açın ve http://localhost:3000 adresine gidin. Industrial IT Service Desk kullanıma hazır!

### 1. Projeyi Klonlayın
```bash
git clone [https://github.com/SENIN_KULLANICI_ADIN/industrial-it-service-desk.git](https://github.com/SENIN_KULLANICI_ADIN/industrial-it-service-desk.git)
cd industrial-it-service-desk
