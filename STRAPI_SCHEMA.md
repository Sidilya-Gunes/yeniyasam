# Strapi CMS — Yeni Yaşam Gazetesi Veritabanı ve Şema Yapılandırması

Bu belge, **Yeni Yaşam Gazetesi** ön yüzünün Strapi CMS (v4 veya v5) ile entegrasyonu için gereken Content Type (Koleksiyon Tipleri) ve alan tanımlarını içerir.

---

## 1. Ortam Değişkenleri (.env.local)
Frontend tarafında aşağıdaki değişkenler tanımlanmalıdır:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=strapi_admin_panelinden_alinan_api_token
```

---

## 2. Strapi Content-Type Modelleri

### A. Articles (`api::article.article`)
* **title** (Text - Short, Required): Haber başlığı
* **slug** (UID, Target Field: `title`, Required): SEO uyumlu URL
* **summary** (Text - Long, Required): Haber özeti / spot metin
* **content** (Rich Text / Blocks veya Markdown): Haberin detaylı gövdesi
* **kicker** (Text - Short): Üst başlık (Örn: Söyleşi, Dosya, Forum)
* **coverImage** (Media - Single image, Required): Kapak görseli
* **category** (Relation): `Article` has one `Category`
* **author** (Relation): `Article` has one `Author`
* **tags** (JSON veya Relation): Etiket listesi
* **isHeadline** (Boolean, Default: false): Ana manşet slider'ında gösterilsin mi?
* **isFeatured** (Boolean, Default: false): Öne çıkan haber mi?
* **readTime** (Text - Short): Örn: "5 dk okuma"
* **publishedAt** (Date/Time): Yayınlanma tarihi

### B. Categories (`api::category.category`)
* **name** (Text - Short, Required): Kategori adı (Örn: Politika, Kadın, Ekoloji, Dünya)
* **slug** (UID, Target Field: `name`, Required): URL yolu (Örn: `politika`, `kadin`, `ekoloji`)
* **description** (Text - Long): Kategori açıklaması
* **color** (Text - Short): Kategoriye özel CSS renk kodu veya değişkeni (Örn: `var(--cat-kadin)`)

### C. Authors (`api::author.author`)
* **name** (Text - Short, Required): Yazar adı soyadı
* **slug** (UID, Target Field: `name`, Required): Yazar URL yolu (Örn: `metin-yegin`)
* **role** (Text - Short): Yazar unvanı veya yazı sayısı (Örn: "128 yazı", "Araştırmacı Yazar")
* **bio** (Text - Long): Kısa biyografi
* **avatar** (Media - Single image): Yazar portre fotoğrafı
* **email** (Email): İletişim e-postası
* **twitter** (Text - Short): X kullanıcı adı (Örn: `@nmetinyegin`)

### D. Videos (`api::video.video`) - Yeni Yaşam Medya
* **title** (Text - Short, Required): Video başlığı
* **slug** (UID, Target Field: `title`): URL yolu
* **category** (Text - Short): Video kategorisi (Örn: Politika, Ekoloji)
* **duration** (Text - Short): Süre (Örn: "08:42")
* **thumbnail** (Media - Single image): Video önizleme görseli
* **videoUrl** (Text - Short): YouTube/Vimeo veya video embed linki

### E. Newsletter Subscribers (`api::newsletter-subscriber.newsletter-subscriber`)
* **email** (Email, Required, Unique): Abone e-posta adresi
* **subscribedAt** (Date/Time): Kayıt tarihi
* **isActive** (Boolean, Default: true): Aktiflik durumu

---

## 3. İzinler (Roles & Permissions)
Strapi Admin Panelinde:
1. **Settings > Users & Permissions Plugin > Roles > Public** (veya özel oluşturulan API Token):
   - `Article`: `find`, `findOne`
   - `Category`: `find`, `findOne`
   - `Author`: `find`, `findOne`
   - `Video`: `find`, `findOne`
   - `Newsletter-Subscriber`: `create`
2. Kaydedin.

---

## 4. Akıllı Fallback & Mock Desteği
Frontend uygulamasında `lib/strapi.ts` içerisinde yerleşik fallback mekanizması bulunur. Strapi CMS henüz kurulmamış olsa veya sunucu bakımda olsa bile frontend çökmez, otomatik olarak gazetenin mockup verilerini sunar. Strapi hazır olduğunda tek yapmanız gereken `.env.local` dosyasına URL ve Token tanımlamaktır.
