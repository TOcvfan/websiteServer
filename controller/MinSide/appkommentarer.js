const mailOmApp = (req, res, nodemailer, inLineCss, dotenv) => {
    dotenv.config();
    const { dato, titel, tekst } = req.body
    const style = `<style>
    h1 {text-align: center;
    color:blue;}
    p {text-align: center;}
    div {text-align: center;}
</style>`;
    const output = `
    <div>
            ${dato}
            <h1>${tekst}</h1>
        </div>
          `;
    const modtagertekst = `${style}<div>${output}</div>`
    const emne = titel ? titel : 'ingen titel'
    let transporter = nodemailer.createTransport({
        host: 'mail.itsmurf.dk',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'contact@itsmurf.dk',
            pass: 'SmurfMis-2013!'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.use('compile', inLineCss());

    let mailOptions = {
        from: `App kommentarer <contact@itsmurf.dk>`,
        to: 'cmh@itsmurf.dk',
        subject: emne,
        text: '',
        html: modtagertekst
    };
    const appkommentarerMail = async () => {

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw res.status(400).send({ message: error, error: true });
            } else {
                return info;
            }
            //console.log(info1)
        })
        res.status(201).send({ message: 'ok', error: false });
    };
    appkommentarerMail().catch(console.error)
}
module.exports = {
    mailOmApp
};