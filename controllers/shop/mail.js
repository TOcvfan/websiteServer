const handleEmailFromShop = (req, res, nodemailer) => {
  const { flereSprog, hvilketSprog, hvadErDetTil, theDesign, DomainPakke, fundetHenne, email, beskrivelse, size, navn } = req.body
  const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <br/>    
        Navn: ${navn}
        <br/>
        Email: ${email}
        <br/>
        Message:
        ${beskrivelse}
        <br/>
        vil du have flere sprog?
        <br/>
        ${flereSprog}
        <br/>
        Hvilke sprog?
        <br/>
        ${hvilketSprog}
        <br/>
        privat/firma?
        <br/>
        ${hvadErDetTil}
        <br/>
        designet?
        <br/>
        ${theDesign}
        <br/>
        domain pakke
        <br/>
        ${DomainPakke}
        <br/>
        størrelse: ${size}
        <br/>
        Contact: ${fundetHenne}
        `;

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

  let mailOptions = {
    from: `${navn} <contact@itsmurf.dk>`,
    to: 'cmh@itsmurf.dk',
    subject: `From ${email}`,
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
  res.end('ok');
}

module.exports = {
  handleEmailFromShop
};
