import React from 'react';
import { shallow, mount } from 'enzyme';

import CashOutRequest from '../index';

const toggleCashout = jest.fn();

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

describe('<CashOutRequest />', () => {
  it('should render correctly and match snapshot', () => {
    const wrapper = shallow(
      <CashOutRequest toggleCashout={toggleCashout} cashoutData={fakeCashoutData} />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should display the correct number of cashout requests', async () => {
    jest.spyOn(CashOutRequest.prototype, 'shouldComponentUpdate');
    const wrapper = mount(<CashOutRequest toggleCashout={toggleCashout} cashoutData={null} />);

    wrapper.setProps({ cashoutData: fakeCashoutData });
    expect(CashOutRequest.prototype.shouldComponentUpdate.mock.calls.length).toBe(2);

    const counterDisplay = wrapper.find('div.counterDisplay');
    const cashoutReqs = Object.keys(wrapper.props().cashoutData).length;
    expect(parseInt(counterDisplay.text(), 10)).toEqual(cashoutReqs);
  });
});
