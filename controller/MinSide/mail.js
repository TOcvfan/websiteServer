const gaestebogMail = (req, res, nodemailer, inLineCss, dotenv) => {
    dotenv.config();
    const { dato, tekst, titel, navn } = req.body
    if (!tekst || !titel || !navn) {
        return res.status(400).send('info mangler');
    }
    const style = `<style>
    h1 {text-align: center;}
    p {text-align: left;}
    div {text-align: center;}
</style>`;
    const output = `
    <div>
        <h1>Fra ${navn}</h1><br/>
            <h3>${titel}</h3><br/>
            ${tekst}<br/>
        <p>${dato}</p>
    </div>
          `;

    var error = null;
    let transporter = nodemailer.createTransport({
        host: 'mail.itsmurf.dk',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.use('compile', inLineCss());
    let mailOptions = {
        from: `gæstebog <contact@itsmurf.dk>`,
        to: 'christian@hammervig.dk',
        subject: titel,
        text: '',
        html: `${style}<div>${output}</div>`
    };

    const mail = async () => {
        await transporter.sendMail(mailOptions, (error1, info1) => {
            if (error1) {
                error = error1
                throw res.status(400).send({ message: error1, error: true });
            }
            //console.log(info1)
        })
        res.status(201).send({ message: 'ok', error: false });
    };
    //res.writeHead(301, {Location:'index.html'});

    mail().catch(console.error)
}

module.exports = {
    gaestebogMail
};