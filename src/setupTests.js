import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

class LocalStorageMock {
    constructor() {
      this.store = {
          authUser: {
            affiliation: "Republican",
            bio: "Forever thinking about chicken nuggs ",
            cashoutRequested: "false",
            displayName: "Hannah",
            email: "hannah.werman@gmail.com",
            emailVerified: false,
            invisibleScore: false,
            isAdmin: false,
            lastActive: "2019-08-06",
            lifetimeEarnings: 5,
            moneyWon: 0,
            soundsOn: true,
            uid: "GvM7fEkYp4fcaSuScwixV0xinfT2"
          }
      };
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
        console.log(key, 'this is key in localstorage')
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = value.toString();
    }
  
    removeItem(key) {
      delete this.store[key];
    }

  };
  
  global.localStorage = new LocalStorageMock();