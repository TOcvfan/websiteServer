const handleSendAlarmer = (req, res, nodemailer, inLineCss) => {      
    const {dato, firstname, middlename, lastname, alarmer, sendeEmail} = req.body;
    let AntalAlarmer = () => {
      if(alarmer===0){
      return ""
      }else if(alarmer === 1){
        return "jeg har kørt <strong>1</strong> alarm denne gang"
      } else return `jeg har kørt <strong>${alarmer}</strong> alarmer denne gang`
    }
    const output = `<div>
        <div style="text-align:center"><h1>Alarmer</h1></div>   
        <div style="float:right;">Dato: ${dato}</div>  
        <div>Hej Karina</div>
        
        <div>${AntalAlarmer()}</div>
        <div>Mvh ${firstname}</div>
        </div>`;
        let middle = () => {if (middlename === null || middlename === undefined || !middlename) {
          return `${firstname} ${lastname}`;
        } else {
          return `${firstname} ${middlename} ${lastname}`;
        }}
  
        let transporter = nodemailer.createTransport({
          host: 'mail.itsmurf.dk',
          port: 465,
          secure: true, // true for 465, false for other ports mail-1.dk 
          auth: {
              user: 'registrerkm@itsmurf.dk',
              pass: 'SmartMailer-2020!'
          },
          tls:{
            rejectUnauthorized: false
          }
        });
        transporter.use('compile', inLineCss());
        let mailOptions = {
            from: `${middle()} <registrerkm@itsmurf.dk>`,
            to: `${sendeEmail}`,
            subject: `Fra ${middle()}`,
            text: '',
            html: output
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }else{
              return console.log(info),
              res.render('contacts', {msg:'Email has been sent'}),
              main().catch(console.error);
            }
            
        });
        
        res.send({'msg':'mail sent'});
  }
  
  module.exports = {
    handleSendAlarmer
  };