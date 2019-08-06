import React from 'react';
import { mount } from 'enzyme';

import StatsPage from '../index';

const uid = "GvM7fEkYp4fcaSuScwixV0xinfT2"
const fakeUserInfo = {
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

describe('<StatsPage />', () => {
    it('should render correctly and match snapshot', () => {
        const wrapper = mount(<StatsPage uid={uid} userInfo={fakeUserInfo} />);
        
        expect(wrapper).toMatchSnapshot();

        const button = wrapper.find('button#cashOut')
        expect(button.text()).toEqual('Cash Out')
    })

    it('button click should toggle a modal', async () => {
        StatsPage.prototype.requestCashOut = jest.fn()
        const wrapper = mount(<StatsPage uid={uid} userInfo={fakeUserInfo} />);
        const button = wrapper.find('button#cashOut')
        expect(wrapper.state('modalOpen')).toBe(false)
        button.simulate('click')
        expect(wrapper.state('modalOpen')).toBe(true)
    })

    // clicking the button in the modal should update the userInfo and 
    // change the ui - button should be disabled.
})

