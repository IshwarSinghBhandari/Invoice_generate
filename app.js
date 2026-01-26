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
    res.render("index")
});

app.post('/create-pdf', (req, res) => {
    const { name, phone, product, rate, quantity, amount, totalamount, totalamountword } = req.body;

    // Generate file path using process.cwd() to get the working directory
    const fileName = `${name}_details.pdf`;
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, fileName);

    // Create the 'public' directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    // Stream errors can corrupt the file
    writeStream.on('error', (err) => {
        console.error('Error writing to file:', err);
        res.status(500).send('Error generating PDF.');
    });

    writeStream.on('finish', () => {
        console.log('PDF generated successfully');
        res.render('download', { filePath: fileName });
    });

    // Generate PDF content
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
});


app.get('/download/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(process.cwd(), 'public', file);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline'); // Open in browser
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending the file:', err);
                res.status(500).send('Error opening the file.');
            }
        });
    } else {
        res.status(404).send('File not found.');
    }
});

// module.exports = app;
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




