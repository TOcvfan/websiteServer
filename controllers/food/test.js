const handleEmail = (req, res, exphbs, nodemailer, db) => {
  const { id } = req.body;
  db.select('*').from('usersfood').where({id}).fullOuterJoin('orders', {id}, 'orders.customerId')
    .fullOuterJoin('orderItem', 'orderItem.orderId', 'orders.orderId')
    .fullOuterJoin('products', 'products.productId', 'orderItem.productId')
    .then(offer => {
      if (offer.length) {
        res.json(offer)
        const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
          
          Name: ${offer[0].fName}
      `;

      let transporter = nodemailer.createTransport({
        host: 'send.one.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'christian@hammervig.dk', // generated ethereal user
            pass: 'SmurfMis-2013!'  // generated ethereal password
        },
        tls:{
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Nodemailer Contact" <christian@hammervig.dk>', // sender address
          to: `${offer[0].email}`, // list of receivers
          bcc: 'christian@hammervig.dk',
          subject: 'Receipt from pizza', // Subject line
          text: 'Hello world?', // plain text body
          html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);   
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          res.render('contacts', {msg:'Email has been sent'});
      });

      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
    
  
}

module.exports = {
  handleEmail
};