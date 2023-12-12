const handleSendKm = (req, res, nodemailer, inLineCss) => {      
    const {dato, firstname, middlename, lastname, alarmer, km_liste, sendeEmail, userMail, totalKm} = req.body;
    let AntalAlarmer = () => {
      if(alarmer===0){
      return ""
      }else if(alarmer === 1){
        return "jeg har kørt <strong>1</strong> alarm denne gang"
      } else return `jeg har kørt <strong>${alarmer}</strong> alarmer denne gang`
    }

    let tomKm_liste = () => {
      if (km_liste === null || km_liste === undefined || !km_liste) {
        return ""
      } else {
        return (
        `
        Her er en liste over mine kørte kilometer</div>
        <table style="width:100%;">
        <tr>
                    <th>dato</th><th>km start</th><th>km slut</th><th>by start</th><th>by slut</th><th>km</th><th>bil</th>
                </tr>
        ${km_liste.map((km, index) => {
            return (
                `<tr key=${index}>
                <td>${km_liste[index].dato}</td><td>${km_liste[index].km_start}</td><td>${km_liste[index].km_slut}</td><td>${km_liste[index].start_by}</td><td>${km_liste[index].slut_by}</td><td>${km_liste[index].km}</td><td>${km_liste[index].bil}</td>
                </tr>`
            )
        })}
        
        </table>
        <label>Jeg har I alt kørt <strong>${totalKm}</strong> kilometer</label`);
        
      }
    }

    let titel = km_liste === undefined ? "Alarmer" : "Kilometer Liste";
    const output = `<div>
        <div style="text-align:center"><h1></h1>${titel}</div>   
        <div style="float:right;">Dato: ${dato}</div>  
        <div>Hej Karina</div>
        ${tomKm_liste()}
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
              pass: ''
          },
          tls:{
            rejectUnauthorized: false
          }
        });
        transporter.use('compile', inLineCss());
        let mailOptions = {
            from: `${middle()} <registrerkm@itsmurf.dk>`,
            to: `${sendeEmail}`,
            bcc: `${userMail}`,
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
    handleSendKm
  };
