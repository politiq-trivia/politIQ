import React from 'react';
import { mount, shallow } from 'enzyme';
import wait from 'waait';

import CashOutReview from '../index';

const fakeCashoutData = {
    GvM7fEkYp4fcaSuScwixV0xinfT2: {
        date: "2019-08-05",
        displayName: "Hannah",
        email: "hannah.werman@gmail.com",
        moneyEarned: 5,
    },
    GvM7fEkYp4fcaSuScwixV0xinfT: {
        date: "2019-08-05",
        displayName: "Hannah",
        email: "hannah.werman@gmail.com",
        moneyEarned: 5,
    },
}

const getCashOutRequests = jest.fn();
const toggleDashboard = jest.fn();

// ? WHAT SHOULD THIS COMPONENT DO - test the critical functionality
describe('<CashOutReview />', () => {
    // If there are no requests, the component should display a message that says no requests available and a button that
    // sends the admin back to the admin dashboard.
    it('should render correcty and match snapshot', () => {
        const wrapper = shallow(<CashOutReview cashoutData={null} getCashOutRequests={getCashOutRequests} toggleDashboard={toggleDashboard}/>);

        expect(wrapper).toMatchSnapshot();
    });

    // Display a table (or equiv.) on the page that contains user cashout requests
    it('renders cashout data properly when present', async () => {
        const wrapper = mount(<CashOutReview cashoutData={fakeCashoutData} getCashOutRequests={getCashOutRequests} toggleDashboard={toggleDashboard}/>);
        
        await wait();
        wrapper.update();
        const renderedData = wrapper.find('div#cashout-holder').first();
        expect(renderedData.text()).toContain("Hannah");

        const requestHolder = wrapper.find('div#all-requests')
        expect(requestHolder.children().length).toBe(2);
    })

    // it('renders acceptcashout button and calls accept function when clicked', async () => {
    //     const wrapper = mount(<CashOutReview cashoutData={fakeCashoutData} getCashOutRequests={getCashOutRequests} toggleDashboard={toggleDashboard}/>);

    //     await wait();
    //     wrapper.update();

    //     const acceptButton = wrapper.find('button#accept-request').first();
    //     // console.log(acceptButton.debug())
    //     acceptButton.simulate('click')

    //     await wait(1000);
    //     wrapper.update();
    //     const requestHolder = wrapper.find('div#all-requests')
    //     console.log(requestHolder.debug())
    //     expect(requestHolder.children().length).toBe(1);
    //     // expect(acceptRequest).toHaveBeenCalled()
    // })
})
