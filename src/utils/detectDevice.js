// function iOS() {

//     var iDevices = [
//       'iPad Simulator',
//       'iPhone Simulator',
//       'iPod Simulator',
//       'iPad',
//       'iPhone',
//       'iPod'
//     ];
  
//     if (!!navigator.platform) {
//       while (iDevices.length) {
//         if (navigator.platform === iDevices.pop()){ return true; }
//       }
//     }
  
//     return false;
// }

// var isChromium = window.chrome;
// var winNav = window.navigator;
// var vendorName = winNav.vendor;
// var isOpera = typeof window.opr !== "undefined";
// var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
// var isIOSChrome = winNav.userAgent.match("CriOS");
// var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);



// export const detectDevice = () => {
//     const oniOS = iOS()
//     console.log(oniOS, 'ios?')
//     if (isSafari) {
//         return 10;
//     } if (oniOS) {
//         return 1;
//     } else if (isIOSChrome) {
//         // is Google Chrome on IOS
//         console.log('on chrome')
//         return 11;
//      } else if(
//        isChromium !== null &&
//        typeof isChromium !== "undefined" &&
//        vendorName === "Google Inc." &&
//        isOpera === false &&
//        isIEedge === false
//      ) {
//         // is Google Chrome
//         console.log('also chrome')
//         return 11;
//      } else { 
//         // not Google Chrome 
//         console.log('not chrome')
//      }
// }