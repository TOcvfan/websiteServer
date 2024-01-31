const gemtester = (req, res, knex, dotenv, nodemailer, inLineCss) => {
    dotenv.config();
    const { email } = req.body
    if (!email) {
        return res.status(400).send('info mangler');
    }
    const tabel = 'apptester'

    const message = `<h1>Tak fordi du tilmeldte dig som tester</h1>
        <p>ingen oplysninger vil blivet videre ud din samtykke</p></div>`
    const style = `<style>
    h1 {text-align: center;
    color:blue;}
    p {text-align: center;}
    div {text-align: center;}
</style>`;
    const output = `
    <div>
        <p>Ny tester tilmedt</p>
        <p>${email}</p>
    </div>
          `;
    const fodnote = `<h1>Der vil være mulighed for at skrive en kommentat til appen her: <a href='https://christian.hammervig.dk/aftensmadvaelger'>christian.hammervig.dk/aftensmadvælger</a>
    <p>du kan også sende en mail til <a href='mailto:admin@itsmurf.dk'>admin@itsmurf.dk</a></p></h1>`
    const modtager = (p) => {
        if (p) {
            return `${style}<div>${message}${fodnote}</div>`
        } else return `${style}<div>${output}</div>`
    }
    var error = null;
    let transporter = nodemailer.createTransport({
        host: 'mail.itsmurf.dk',
        port: 465,
        secure: true, // true for 465, false for other ports
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
        from: `Ny tester<contact@itsmurf.dk>`,
        to: 'christian@hammervig.dk',
        subject: 'Ny tester',
        text: '',
        html: modtager()
    };
    let mailOptions2 = {
        from: `Kan ikke besvares<contact@itsmurf.dk>`,
        to: email,
        subject: 'Tak for din tilmelding som tester!!',
        text: '',
        html: modtager(true)
    };
    const cvmail = async () => {

        const modtagermail = async () => await transporter.sendMail(mailOptions2, (error2, info2) => {
            if (error2) {
                error = error2
                throw res.status(400).send({ message: error2, error: true });
            } else {
                return info2;
            }
        });

        await transporter.sendMail(mailOptions, (error1, info1) => {
            if (error1) {
                error = error1
                throw res.status(400).send({ message: error1, error: true });
            } else {
                modtagermail()
            }
            //console.log(info1)
        })
        res.status(201).send({ message: 'ok', error: false });
    };
    //res.writeHead(301, {Location:'index.html'});
    knex(tabel).insert({ email }).then(() => {
        cvmail().catch(console.error)
    }).catch(err => {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(208).send({ message: 'du er allerede tilmeldt', error: true, findes: true })
        } else return res.status(400).send({ message: err.code, error: true })
    })
}

module.exports = {
    gemtester
};