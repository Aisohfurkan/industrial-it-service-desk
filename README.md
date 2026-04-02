# 🏭 Industrial IT Service Desk (v4.2.0)

Bu proje, büyük ölçekli fabrikalar ve endüstriyel tesisler için tasarlanmış, **Next.js 14**, **Tailwind CSS** ve **Supabase** tabanlı profesyonel bir Bilişim Olay Yönetim Sistemi (Incident Management System) altyapısıdır.

![Sistem Ön İzleme](https://via.placeholder.com/800x400?text=Industrial+IT+Service+Desk+Preview)

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

## 📦 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

### 1. Projeyi Klonlayın
```bash
git clone [https://github.com/kullanici-adin/it-destek-paneli.git](https://github.com/kullanici-adin/it-destek-paneli.git)
cd it-destek-paneli