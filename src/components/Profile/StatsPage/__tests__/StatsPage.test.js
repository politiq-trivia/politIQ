import React from 'react';
import { mount } from 'enzyme';

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
        const wrapper = mount(<StatsPage uid={uid} userInfo={fakeUserInfo} />);
        
        expect(wrapper).toMatchSnapshot();

        const button = wrapper.find('button#cashOut')
        expect(button.text()).toEqual('Cash Out')
    })

    it('button click should toggle a modal if the user has not previously requested a cashout and has a nonzero moneyWon', async () => {
        global.localStorage.setItem('authUser', JSON.stringify(fakeUserInfo));

        const wrapper = mount(<StatsPage uid={uid} userInfo={fakeUserInfo} />);

        const button = wrapper.find('button#cashOut')
        expect(wrapper.state('modalOpen')).toBe(false)
        expect(button.props().disabled).toBe(false)
        button.simulate('click')
        expect(wrapper.state('modalOpen')).toBe(true)

        // expect a modal component to be rendered
        wrapper.update()
        const modal = wrapper.find('Modal')

        expect(modal.props().open).toBe(true)

        global.localStorage.clear();
    })

    it('button click should be disabled if user has requested a cashout', async () => {
        const wrapper = mount(<StatsPage uid={uid} userInfo={fakeUserInfo} />);

        wrapper.setState({ cashoutRequested: true });
        wrapper.update();

        expect(wrapper.state().cashoutRequested).toBe(true);
        const button = wrapper.find('button#cashOut');
        expect(button.props().disabled).toBe(true)
        button.simulate('click');
        // button click should not trigger the modal because the button is disabled
        expect(wrapper.state('modalOpen')).toBe(false)
    })
})

