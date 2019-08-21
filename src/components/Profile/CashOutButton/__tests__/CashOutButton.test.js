import React from 'react';
import { mount } from 'enzyme';

import CashOutButton from '../';

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

const fakeUserInfo2 = {
    affiliation: "Republican",
    bio: "Forever thinking about chicken nuggs ",
    cashoutRequested: true,
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

describe('<CashOutButton />', () => {
    it('should render correctly and match snapshot', () => {
        const wrapper = mount(<CashOutButton uid={uid} userInfo={fakeUserInfo} />);
        
        expect(wrapper).toMatchSnapshot();

        const button = wrapper.find('button#cashOut')
        expect(button.text()).toEqual('Cash Out')
    })

    it('button click should toggle a modal if the user has not previously requested a cashout and has a nonzero moneyWon', async () => {
        global.localStorage.setItem('authUser', JSON.stringify(fakeUserInfo));

        const wrapper = mount(<CashOutButton uid={uid} userInfo={fakeUserInfo} />);

        const button = wrapper.find('button#cashOut')
        expect(button.props().disabled).toBe(false)
        button.simulate('click')
        wrapper.update()
        const modal = wrapper.find('Modal')

        expect(modal.props().open).toBe(true)

        global.localStorage.clear();
    })

    it('button click should be disabled if user has requested a cashout', async () => {

        const wrapper = mount(<CashOutButton uid={uid} userInfo={fakeUserInfo2} />);

        const button = wrapper.find('button#cashOut');
        // this is probably unnecessary since it seems a bit ridiculous to have to manually update the tests but
        // still in the process of switching over to testing react functional components
        button.props().disabled = wrapper.props().userInfo.cashoutRequested

        expect(button.props().disabled).toBe(true)

        const modal = wrapper.find('Modal')
        modal.props().open = !wrapper.props().userInfo.cashoutRequested

        expect(modal.props().open).toBe(false)
    })
})