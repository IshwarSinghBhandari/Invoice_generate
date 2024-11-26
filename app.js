import express from 'express';
import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public folder

app.get('/', (req, res) => {
    res.render('form');
});

app.post('/create-pdf', (req, res) => {
    const { name, phone, product,rate,quantity,amount,totalamount,totalamountword } = req.body;

    // Generate file path using process.cwd() to get the working directory
    const fileName = `${name}_details.pdf`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    // Create the 'public' directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
        fs.mkdirSync(path.join(process.cwd(), 'public'));
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    doc.pipe(writeStream);

    doc.fontSize(25).text('User Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${name}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Product: ${product}`);
    doc.text(`Rate: ${rate}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Amount: ${amount}`);
    doc.text(`Total Amount: ${totalamount}`);
    doc.text(`Total Amount In Word: ${totalamountword}`);

    doc.end();

    writeStream.on('finish', () => {
        res.render('download', { filePath: `/public/${fileName}` });
    });
});

app.get('/download/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(process.cwd(), 'public', file);

    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file.');
            }
        });
    } else {
        res.status(404).send('File not found.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





// import express from 'express';
// import bodyParser from 'body-parser';
// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// import { fileURLToPath } from 'url'; // Required for __dirname in ES Modules

// // Get the directory name in an ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public')); // Serve static files

// app.get('/', (req, res) => {
//     res.render('form');
// });

// app.post('/create-pdf', (req, res) => {
//     const { name, email, message } = req.body;

//     // Generate file path and ensure 'public' folder exists
//     const fileName = `${name}_details.pdf`;
//     const filePath = path.join(__dirname, 'public', fileName);

//     // Create the 'public' directory if it doesn't exist
//     if (!fs.existsSync(path.join(__dirname, 'public'))) {
//         fs.mkdirSync(path.join(__dirname, 'public'));
//     }

//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(filePath);

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

//     doc.pipe(writeStream);

//     doc.fontSize(25).text('User Details', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(16).text(`Name: ${name}`);
//     doc.text(`Email: ${email}`);
//     doc.text(`Message: ${message}`);

//     doc.end();

//     writeStream.on('finish', () => {
//         res.render('download', { filePath: `/public/${fileName}` });
//     });
// });

// app.get('/download/:file', (req, res) => {
//     const file = req.params.file;
//     const filePath = path.join(__dirname, 'public', file);

//     if (fs.existsSync(filePath)) {
//         res.download(filePath, (err) => {
//             if (err) {
//                 console.error('Error downloading the file:', err);
//                 res.status(500).send('Error downloading the file.');
//             }
//         });
//     } else {
//         res.status(404).send('File not found.');
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


