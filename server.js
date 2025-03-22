const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Konfigurasi koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',   
    user: 'root',        
    password: '',        
    database: 'webcloud-app' 
});

// Coba koneksi ke database
db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
    } else {
        console.log('Terhubung ke database MySQL');
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Halaman utama
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
            <h1>Hello, World!</h1>
            <a href="/form">Isi Form</a>
        </body>
        </html>
    `);
});

// Halaman Form Input
app.get('/form', (req, res) => {
    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css">
        </head>
        <body>
            <h1>Form Input</h1>
            <form action="/submit" method="post">
                <label>Nama:</label>
                <input type="text" name="nama" required><br>
                <label>Email:</label>
                <input type="email" name="email" required><br>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
});

// Menyimpan data ke database
app.post('/submit', (req, res) => {
    const { nama, email } = req.body;
    const query = 'INSERT INTO users (nama, email) VALUES (?, ?)';

    db.query(query, [nama, email], (err, result) => {
        if (err) {
            console.error('Gagal menyimpan data:', err);
            res.send('<h1>Gagal menyimpan data</h1>');
        } else {
            res.send(`
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/style.css">
                </head>
                <body>
                    <h1>Data Berhasil Disimpan</h1>
                    <p>Nama: ${nama}</p>
                    <p>Email: ${email}</p>
                    <a href="/data">Lihat Data</a>
                </body>
                </html>
            `);
        }
    });
});

// Halaman untuk menampilkan data dari database
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data:', err);
            res.send('<h1>Gagal mengambil data</h1>');
        } else {
            let dataHtml = `
                <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/style.css">
                </head>
                <body>
                    <h1>Data Pengguna</h1>
                    <table border="1" cellspacing="0" cellpadding="5">
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Email</th>
                        </tr>
            `;
            results.forEach(row => {
                dataHtml += `<tr><td>${row.id}</td><td>${row.nama}</td><td>${row.email}</td></tr>`;
            });
            dataHtml += `</table><br><a href="/">Kembali</a></body></html>`;

            res.send(dataHtml);
        }
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
