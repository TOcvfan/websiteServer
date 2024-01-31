const glemtPassword = async (req, res, nodemailer, inLineCss, knexDb, jwt, dotenv) => {
    dotenv.config();
    const { email } = req.body;
    let token;
    const style = `<style>
    h1 {text-align: center;}
    p {text-align: left;}
    div {text-align: center;}
</style>`;
    const output = (token, id, email) => {
        return (`
        <div>
            <h1>You are receiving this because you (or someone else) have requested the reset of the password for your account</h1><br/>
                <h3>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</h3><br/>
                <a href='https://christian.hammervig.dk/reset/${token}/${id}/${email}/'>Reset password</a><br/>
            <p>If you did not request this, please ignore this email and your password will remain unchanged</p>
        </div>
              `);
    }

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
    const mail = async (token, id, email) => {
        let mailOptions = {
            from: `forgot password service <contact@itsmurf.dk>`,
            to: email,
            subject: 'forgot password service',
            text: '',
            html: `${style}<div>${output(token, id, email)}</div>`
        };

        await transporter.sendMail(mailOptions, (error, info1) => {
            if (error) {
                //error = error1
                throw res.status(400).send(error);
            }
            console.log(info1.response)
        })
        res.status(201).send({ message: 'ok', error: false });
    };
    const tabel = 'bruger';

    const opdater = async (id, role) => {
        token = await jwt.sign({ role, id }, process.env.SECRET_OR_KEY, { expiresIn: '1h' });
        mail(token, id, email).catch(console.error)
    }

    knexDb(tabel)
        .where('email', email)
        .then(data => {
            data[0] === undefined ? res.status(409).send({ message: email, error: true }) : opdater(data[0].id, data[0].role)
        })
        .catch(err => res.status(400).json({ message: err, error: true }));
}


module.exports = {
    glemtPassword
};