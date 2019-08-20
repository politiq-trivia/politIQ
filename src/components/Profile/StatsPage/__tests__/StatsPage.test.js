import React from 'react';
import { shallow } from 'enzyme';

import StatsPage from '../index';

const uid = "GvM7fEkYp4fcaSuScwixV0xinfT2"
const fakeUserInfo = {
    affiliation: "Republican",
    bio: "Forever thinking about chicken nuggs ",
    cashoutRequested: false,
    displayName: "Hannah",
    email: "hannah.werman@gmail.com",
    emailVerified: false,
    invisibleScore: false,
    isAdmin: false,
    lastActive: "2019-08-06",
    lifetimeEarnings: 5,
    moneyWon: 5,
    soundsOn: true,
    uid: "GvM7fEkYp4fcaSuScwixV0xinfT2"
}

describe('<StatsPage />', () => {
    it('should render correctly and match snapshot', () => {
        const wrapper = shallow(<StatsPage uid={uid} userInfo={fakeUserInfo} />)
        
        expect(wrapper).toMatchSnapshot();
    })
})

