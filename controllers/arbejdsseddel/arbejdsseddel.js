const handleArbejdsseddel = (req, res, nodemailer) => {      
    const output = `<div>
        <div style="text-align:center"><h1>Arbejdsseddel</h1></div>   
        <div>Kunde Navn: ${req.body.kundeNavn} <div style="float:right;">Dato: ${req.body.dato}</div></div>  
        <div>Kontakt person: ${req.body.kontaktPerson} <div style="float:right;">KontaktTlf: ${req.body.kontaktTlf}</div></div>
        <div style="float:right;">Telefon: ${req.body.telefon}</div><div style="float:right;">Ordrenr.: ${req.body.ordreNr}</div>
        <div>Faktura Adresse</div>
        <div>${req.body.fakturaAdresse}</div>
        <div>Post nr.:${req.body.fpost} By: ${req.body.fby}</div>
        <div>E-mail: ${req.body.email}</div>
        <div>Arbejds Adresse</div>
        <div>${req.body.arbejdsAdresse}</div>
        <div>Post nr.: ${req.body.apost} By: ${req.body.aby}</div>
        <div>Arbejde: </div>
        <div>${req.body.arbejde}</div>
        <table style="width:100%;">
        <tr>
                    <th>Matrialer</th><th>antal</th><th>pris</th>
                </tr>
        ${req.body.matrialeliste.map((matriale, index) => {
            return (
                `<tr key=${index}>
                    <td>${req.body.matrialeliste[index].matrialer}</td><td>${req.body.matrialeliste[index].antal}</td><td>${req.body.matrialeliste[index].pris}</td>
                </tr>`
            )
        })}
        
        </table>
        </div>`;
  
        let transporter = nodemailer.createTransport({
          host: 'mail.jbsikring.dk',
          port: 587,
          secure: false, // true for 465, false for other ports mail-1.dk 
          auth: {
              user: 'bb@jbsikring.dk',
              pass: ''
          },
          tls:{
            rejectUnauthorized: false
          }
        });
  
        let mailOptions = {
            from: `Brian Bokelund <bb@jbsikring.dk>`,
            to: `${req.body.sendeEmail}`,
            subject: `From Brian`,
            text: '',
            html: output
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }else{
              return console.log(info),
              console.log('Message sent: %s', info.messageId),   
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)),
              res.render('contacts', {msg:'Email has been sent'}),
              main().catch(console.error);
            }
            
        });
        //res.writeHead(301, {Location:'index.html'});
        res.end();
  }
  
  module.exports = {
    handleArbejdsseddel
  };
