const handleBeskrivelse = (req, res, nodemailer) => {
    const { vognbeskriv, madbeskriv, morgenmadbeskriv, faellesspisningbeskriv, convoyturbeskriv, visdinbilbeskriv, markedbeskriv, baalbeskriv, auktionbeskriv, prisbeskriv, ventilbeskriv,
        vogn, mad, morgenmad, faellesspisning, convoytur, visdinbil, marked, baal, auktion, pris, ventil } = req.body;

    const output = `
        <h1>Fra ris/ros side</h1>
          <br/>
        Pølsevogn ${vogn} <br/>
        ${vognbeskriv}
        <br/>
        Morgenmad ${morgenmad}
        <br/>
        ${morgenmadbeskriv}
        <br/>
        maden ${mad}
        <br/>
        ${madbeskriv} 
        <br/>
        ventildækselræs ${ventil}
        <br/>
        ${ventilbeskriv} 
        <br/>
        fælles spisning  ${faellesspisning}
        <br/>
        ${faellesspisningbeskriv}
        <br/>
        Convoytur  ${convoytur}
        <br/>
        ${convoyturbeskriv}
        <br/>
        Vis din bil  ${visdinbil}
        <br/>
        ${visdinbilbeskriv}
        <br/>
        kræmmermarked  ${marked}
        <br/>
        ${markedbeskriv}
        <br/>
        Bål  ${baal}
        <br/>
        ${baalbeskriv}
        <br/>
        Auktion  ${auktion}
        <br/>
        ${auktionbeskriv}
        <br/>
        Pris ${pris}
        <br/>
        ${prisbeskriv}
          `;

    let transporter = nodemailer.createTransport({
        host: 'mail.citraef.dk',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'risros@citraef.dk',
            pass: 'enHIgBchiA1S'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: `Ris/Ros side <risros@citraef.dk>`,
        to: 'info@citraef.dk',
        subject: `Ris/Ros`,
        text: '',
        html: output
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            return console.log(info),
                console.log('Message sent: %s', info.messageId),
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)),
                res.render('contacts', { msg: 'Email has been sent' }),
                main().catch(console.error);
        }
    });
    //res.writeHead(301, {Location:'index.html'});
    res.end();
}

module.exports = {
    handleBeskrivelse
};