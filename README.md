# Aşçılık Ders Programı · Esenyurt Üniversitesi MYO

2026-2027 Güz dönemi Aşçılık Programı ders programının **tek dosyalık**, iPhone uyumlu web sürümü.

## Çalıştırma

```bash
node server.js          # veya: npm start
# http://127.0.0.1:8080/ascilik.html
# aynı Wi-Fi'daki telefondan: http://<bilgisayarın-ip'si>:8080/ascilik.html
```

Sunucuya gerek yok: `ascilik.html` dosyasını doğrudan Safari'de açabilirsin.
iPhone'da uygulama gibi kullanmak için **Paylaş → Ana Ekrana Ekle**.

## İçerik

- 4 yarıyıl sekmesi. **1. ve 3. yarıyıl** dolu; **2. ve 4. yarıyıl** paylaşılan
  2026-2027 *Güz* programında bulunmadığı için "Program yok" gösterir.
  (Bahar dönemi programı ayrıca yayınlanır.)
- Bugün / Hafta / Dersler sekmeleri: saat, derslik, öğretim görevlisi, kredi.
- Perşembe **13:00-15:00** bloğunda 11 ortak seçmeli ders var; uygulama bunları
  tek slota indirir ve seçimi cihazda hatırlar.
- Tamamen çevrimdışı çalışır, harici kaynak yüklemez.

## Dosyalar

| Dosya | Açıklama |
| --- | --- |
| `ascilik.html` | Yayınlanan tek dosyalık uygulama |
| `ascilik.head.html`, `ascilik.tail.html`, `ascilik.data.json` | Uygulamanın parçaları (arama motoru) |
| `server.js`, `start-server.sh` | Yerel sunucu |
| `parse.awk` | PDF metnini JSON'a çeviren ayrıştırıcı |
| `test-ascilik.js` | Mantık testleri (tüm yarıyıllar + seçmeli akışı) |

Resmî olmayan öğrenci özetidir; kaynak: Esenyurt Üniversitesi MYO 2026-2027 Güz ders programı.
