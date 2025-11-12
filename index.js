// server.js

const express = require('express');
const { translate } = require('@vitalets/google-translate-api');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware untuk mem-parsing JSON body
app.use(express.json());

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API untuk menerjemahkan teks
app.post('/api/translate', async (req, res) => {
    const { text, to } = req.body;

    // Validasi input
    if (!text || !to) {
        return res.status(400).json({ error: 'Teks dan bahasa tujuan (to) diperlukan.' });
    }

    try {
        // Panggilan ke API terjemahan
        // 'from' (bahasa sumber) diatur ke 'auto' (deteksi otomatis)
        const result = await translate(text, { to: to, from: 'auto' });
        
        const detectedLang = 
            (result.from && result.from.language && result.from.language.iso) 
            ? result.from.language.iso 
            : 'unknown'; // Jika tidak ada, atur ke 'unknown' atau 'auto'

        // Mengirim hasil terjemahan kembali ke klien
        res.json({ 
            translatedText: result.text,
            detectedLanguage: detectedLang // Gunakan variabel yang sudah diamankan
        });

    } catch (error) {
        console.error('Kesalahan saat menerjemahkan:', error.message);
        res.status(500).json({ error: 'Gagal melakukan terjemahan.' });
    }
});

// Mulai Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log('Buka browser dan akses alamat tersebut.');
});