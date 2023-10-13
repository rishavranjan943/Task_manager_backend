// import nodemailer from 'nodemailer'

// const transporter=nodemailer.createTransport({
//     service : 'gmail',
//     auth : {
//         user : 'rishavranjan7543@gmail.com',
//         // pass : process.env.PASS
//         pass : 'gkju qore ymvk nqrp'
//     }
// });
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rishavranjan7543@gmail.com',
        pass : process.env.PASS
    }
});

// const mailOption={
//     from : 'rishavranjan7543@gmail.com',
//     to : 'rishavranjan201204@gmail.com',
//     subject : 'Sending Emails using Node.js',
//     text : 'Hii Rishav sending by nodemailer'
// };

// const sendEmail=async (mailOption) => {
//     try {
//         await transporter.sendMail(mailOption)
//         console.log('Email sent')
//     } catch(e) {
//         console.log(e)
//     }
// }

// sendEmail(mailOption)

const sendWelcomeEmail = async (email,name) => {
    await transporter.sendMail({
        to : email,
        from : 'rishavranjan7543@gmail.com',
        subject : 'Thanks for joining in !',
        text :`Welcome to app ${name}. Let me know you get along with us.`,
        html : '<h1>Hello guys</h1>'
    })
}

const sendCancelationEmail = async(email,name) => {
    await transporter.sendMail({
        to : email,
        from : 'rishavranjan7543@gmail.com',
        subject : 'Sorry to see you go !',
        text : `Goodbye ${name}. I hope to see u again.`
    })
}


export { sendWelcomeEmail, sendCancelationEmail }