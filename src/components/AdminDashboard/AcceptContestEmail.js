// import React, { Component } from 'react';
// // import nodemailer from 'nodemailer';
// import { GOOGLE_CLIENT_ID, GOOGLE_SHEETS_KEY, GOOGLE_SHEETS_ID } from '../../fb_auth';
// import ReactGoogleSheets from 'react-google-sheets';
 
 
// class DataComponent extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       sheetLoaded: false,
//     }
//   }
//   render() {
//     return (
//       <ReactGoogleSheets 
//         clientId={GOOGLE_CLIENT_ID}
//         apiKey={GOOGLE_SHEETS_KEY}
//         spreadsheetId={GOOGLE_SHEETS_ID}
//         afterLoading={() => this.setState({sheetLoaded: true})}
//       >
//         {this.state.sheetLoaded ? 
//           <div>
//             {/* Access Data */}
//             {console.log('Your sheet data : ', this.props.getSheetsData("contested questions"))}
//             {/* Update Data */}
//             <button onClick={() => {
//               this.props.updateCell(
//                 'sheet02', // sheetName
//                 'E', // column
//                 13, // row
//                 'Apple', // value
//                 null, // successCallback
//                 (error) => {
//                   console.log('error', error)
//                 } // errorCallback
//               );
//             }}>update cell!</button>
//           </div>
//           :
//           'loading...'
//         }
//       </ReactGoogleSheets>
//     )
//   }
// }
 
// export default ReactGoogleSheets.connect(DataComponent);


// // const smtpTransport = nodemailer.createTransport('SMTP', {
// //     service: 'Gmail',
// //     auth: {
// //         XOAuth2: {
// //             user: "iknowpolitics.us@gmail.com",
// //             clientId: "8819981768.apps.googleusercontent.com",
// //             clientSecret: "{client_secret}",
// //             refreshToken: "1/xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI",
// //             accessToken: "vF9dft4qmTc2Nvb3RlckBhdHRhdmlzdGEuY29tCg==",
// //             timeout: 3600
// //         }
// //     }
// // });

// // const mailOptions = {
// //     from: "PolitIQ <iknowpolitics.us@gmail.com>",  // sender address
// //     to: "hannah.werman@gmail.com", // list of recipients
// //     subject: "Accepted Issue with Question", // subject line 
// //     text: "This is the body of the email", // email body,
// //     html: "<b>Hello World</b>", // html body
// // }

// // export const sendEmail = () => {
// //     console.log(EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET)

// //     smtpTransport.sendMail(mailOptions, function(error, response) {
// //         if(error) {
// //             console.log(error);
// //         } else {
// //             console.log('Message sent: ' + response.message)
// //         }
// //     })
// // }

// // const AcceptContest = () => {
// //     return (
// //         <div>email</div>
// //     )
// // }