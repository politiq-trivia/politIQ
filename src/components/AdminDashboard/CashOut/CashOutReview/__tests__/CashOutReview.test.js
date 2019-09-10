import React from 'react';
import { mount, shallow } from 'enzyme';
import wait from 'waait';

import CashOutReview from '../index';

const fakeCashoutData = {
  GvM7fEkYp4fcaSuScwixV0xinfT2: {
    date: '2019-08-05',
    displayName: 'Hannah',
    email: 'hannah.werman@gmail.com',
    moneyEarned: 5,
  },
  GvM7fEkYp4fcaSuScwixV0xinfT: {
    date: '2019-08-05',
    displayName: 'Hannah',
    email: 'hannah.werman@gmail.com',
    moneyEarned: 5,
  },
};

const getCashOutRequests = jest.fn();
const toggleDashboard = jest.fn();
// const acceptRequest = jest.fn();

describe('<CashOutReview />', () => {
  // If there are no requests, the component should display a message that says no
  // requests available and a button that sends the admin back to the admin dashboard.
  it('should render correcty and match snapshot', () => {
    const wrapper = shallow(
        <CashOutReview
          cashoutData={null}
          getCashOutRequests={getCashOutRequests}
          toggleDashboard={toggleDashboard}
        />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  // Display a table (or equiv.) on the page that contains user cashout requests
  it('renders cashout data properly when present', async () => {
    const wrapper = mount(
        <CashOutReview
          cashoutData={fakeCashoutData}
          getCashOutRequests={getCashOutRequests}
          toggleDashboard={toggleDashboard}
        />,
    );

    await wait();
    wrapper.update();
    const renderedData = wrapper.find('div#cashout-holder').first();
    expect(renderedData.text()).toContain('Hannah');

    const requestHolder = wrapper.find('div#all-requests');
    expect(requestHolder.children().length).toBe(2);
  });

  // todo: learn more about mocking functions and fix this test so that it can call the
  // acceptcashout method and then update
  // state accordingly

  // it('renders acceptcashout button and calls accept function when clicked', async () => {
  //     // jest.spyOn(CashOutReview.prototype, 'acceptRequest')
  //     // console.log(CashOutReview)
  //     // CashOutReview.prototype.handleClick = jest.fn();
  //   const wrapper = mount(
  //     <CashOutReview
  //       cashoutData={fakeCashoutData}
  //       getCashOutRequests={getCashOutRequests}
  //       toggleDashboard={toggleDashboard}
  //       onClick={acceptRequest}/>,
  //   );

  //     await wait();
  //     wrapper.update();

  //     const acceptButton = wrapper.find('button#accept-request').first();
  //     console.log(acceptButton.debug())
  //     console.log(acceptButton.props())
  //     // acceptButton.setProps({ onClick: acceptRequest });
  //     // acceptButton.simulate('click')
  //     acceptButton.props().onClick = jest.fn()
  // //     console.log(acceptButton.debug())
  // //     ! this doesn't work because I'm trying to pass a mocked onclick to the component
  // //     ! but it isn't going to the button directly, which is what I want it to do
  // //     acceptButton.simulate('click');
  //     expect(acceptButton.props().onClick()).toHaveBeenCalled();
  // })
});
