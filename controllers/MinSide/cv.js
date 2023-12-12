const handleEmailFromCV = (req, res, nodemailer, inLineCss) => {
    const { email, besked, emne, navn, firmanavn } = req.body
    if (!email || !besked || !emne || !navn || !firmanavn) {
        return res.status(400).send('info mangler');
    }

    const message = `<style>div { color:red; }</style><div>Dette er beskeden du sendte til Christian M. Hammervig</div>`
    const style = `<style>
    h1 {text-align: center;}
    p {text-align: center;}
    div {text-align: center;}
</style>`;
    const output = `
    <div>
        <p>Fra ${firmanavn}</p>
            ${besked}
        <p>${navn}</p>
        <p>${email}</p>
    </div>
          `;
    const fodnote = `<h1>mail: christian@hammervig.dk tlf: 41571079</h1>`
    const modtager = (p) => {
        if (p) {
            return `${style}<div>${message}${output}${fodnote}</div>`
        } else return `${style}<div>${output}</div>`
    }
    var error = null;
    let transporter = nodemailer.createTransport({
        host: 'mail.itsmurf.dk',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'contact@itsmurf.dk',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.use('compile', inLineCss());
    let mailOptions = {
        from: `fra cv side <contact@itsmurf.dk>`,
        to: 'christian@hammervig.dk',
        subject: emne,
        text: '',
        html: modtager()
    };
    let mailOptions2 = {
        from: `Christian Munch Hammervig's cv side <contact@itsmurf.dk>`,
        to: email,
        subject: emne,
        text: '',
        html: modtager(true)
    };
    const cvmail = async () => {

        const modtagermail = async () => await transporter.sendMail(mailOptions2, (error2, info2) => {
            if (error2) {
                error = error2
                throw res.status(400).send(error);
            } else {
                return info2;
            }
        });

        await transporter.sendMail(mailOptions, (error1, info1) => {
            if (error1) {
                error = error1
                throw res.status(400).send(error);
            } else {
                modtagermail()
            }
            //console.log(info1)
        })
        res.status(201).send('ok');
    };
    //res.writeHead(301, {Location:'index.html'});

    cvmail().catch(console.error)
}

module.exports = {
    handleEmailFromCV
};
