# Hassan Carpenter — Activity Log

Sab changes jo is session mein kiye gaye. (Maine kisi bhi change ke baad `npm run build` nahi chalaya — shell tool disabled tha. Deploy se pehle `npm run build` zaroor chalayein.)

## 1. Header (compact) + icons
- `src/components/Header.jsx`: height 48px (mobile) / 56px (desktop), kam padding. Navigation mein icons (About, Services, Work, Videos); mobile par sirf icons, desktop par icons + labels. Button ka label "Call".
- `src/components/Footer.jsx`: phone, WhatsApp, map links par `lucide-react` icons.
- `lucide-react` pehle se installed tha; zyada tar icons pehle se lucide ke the.

## 2. Video gallery
- Naya `src/components/VideoGallery.jsx`: jin projects ka `video_url` ho unka responsive grid, section id `videos`. Koi video na ho to section hide.
- `src/pages/HomePage.jsx`: `Gallery` ke baad render.
- `src/components/Gallery.jsx`: purana "▶ Videos" filter tab hata diya; video-only projects ke liye `<video>` thumbnail.

## 3. Admin: video upload
- `src/components/admin/ProjectForm.jsx`:
  - "Upload photo" / "Upload video" ke styled buttons (icons ke sath, file ka naam dikhate hain).
  - Video file upload (max 50 MB) `portfolio-images/videos/` mein; preview aur Remove.
  - YouTube link ka option bhi maujood; file ho to file use hoti hai.
  - Replace/remove par purani video file storage se delete; save fail ho to naye uploads rollback.
  - Validation: photo ya video mein se ek zaroori.
- `src/components/admin/ProjectList.jsx`: delete par video file bhi delete; video thumbnail fallback.
- `src/lib/media.js`: naya `isFileVideo(url)` helper.
- `src/components/YouTubeEmbed.jsx`: file URL ho to native `<video controls>`.
- Column naam `video_url` hi rakha (`youtube_link` nahi) — rename ke liye migration chahiye hoti.

## 4. Supabase fixes (aap ko SQL khud chalani thi)
- Error "mime type video/mp4 is not supported": bucket sirf images allow karta tha, limit 2 MB thi.
  ```sql
  update storage.buckets
  set file_size_limit = 52428800,
      allowed_mime_types = array['image/webp','image/jpeg','image/png','video/mp4','video/webm','video/quicktime']
  where id = 'portfolio-images';
  ```
- Error `projects_video_url_check`: constraint sirf YouTube links allow karta tha.
  ```sql
  alter table public.projects drop constraint projects_video_url_check;
  alter table public.projects add constraint projects_video_url_check check (
    video_url ~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be)/'
    or video_url ~ '^https://[^/]+/storage/v1/object/public/portfolio-images/videos/'
  );
  ```
- `schema.sql` mein dono changes bhi likh diye (naye setup ke liye).
- Free plan par global storage limit 50 MB hai; us se bari videos ke liye YouTube link behtar.

## 5. Services cards (`src/components/Services.jsx`)
- Icons bade: 80px amber (`bg-amber-100`) rounded box, 40px icon, centered.
- Naye icons: `UtensilsCrossed`, `Sofa`, `DoorOpen`, `Paintbrush`.
- Photo frame: rounded, inset, `object-cover object-center`, hover zoom.
- Photos ab aap ke diye hue Unsplash URLs se (Kitchen `photo-1556911220-e15b29be8c8f`, Furniture `photo-1555041469-a586c61ea9bc`, Doors `photo-1541123437800-1bb1317badc2`, Repair `photo-1504148455328-c376907d081c`). Load na ho to icon dikhta hai.

## 6. Images
- `src/components/AboutSection.jsx`: fixed aspect ratio hata kar `h-auto max-h-[80vh] object-contain` — image poori dikhti hai.
- Finding: `public/about.webp` khud neeche se kati hui hai ("لوکیشن حاصل کریں" adhoora). Poori original image se replace karni hogi.
- `src/components/Hero.jsx`: background image par `object-center`.

## 7. Hero (`src/components/Hero.jsx`) + Urdu text
- English text waisa hi; uske neeche Urdu line: "لکڑی کا ہر کام — الماری، کچن، بیڈ، پالش، اور ڈورز — مکمل تسلی بخش کیا جاتا ہے۔"
- `lang="ur"`, `dir="rtl"`, font Noto Nastaliq Urdu (`index.html` mein Google Fonts link), amber rang.
- Single line (`whitespace-nowrap`), chota font `clamp(10px, 3.2vw, 18px)`, `text-left`.
- Hero ki upar/neeche ki jagah kam: `py-6 md:py-8`; Urdu line ka gap/line-height kam.

## Baqi kaam / dhyan dene wali baatein
- `npm run build` chalana baqi hai.
- Bohat chhoti screen par Urdu font 10px ho jata hai — parhne mein mushkil ho to bata dein.
- `about.webp` ki poori image chahiye.
- Git status mein `package.json` / `package-lock.json` pehle se modified thay (is session se nahi).
