import React from 'react';
import { shallow } from 'enzyme';

import ReviewQuestions from '../index';

const fakeState = {
  selectedQ: {
    a1correct: true,
    a1text: 'test',
    a2correct: false,
    a2text: '',
    a3correct: false,
    a3text: '',
    displayName: 'Hannah',
    fromUser: 'GvM7fEkYp4fcaSuScwixV0xinfT2',
    q1: 'testing the context',
    source: 'asdfasdf',
    userEmail: 'hannah.werman@gmail.com',
  },
  loaded: true,
};

describe('<ReviewQuestions />', () => {
  it('should render correctly and match snapshot', () => {
    const wrapper = shallow(<ReviewQuestions />);
    let username = wrapper.find('Link[data-target="username"]');

    expect(username.contains('Hannah')).toBe(false);

    wrapper.setState({ ...fakeState });

    wrapper.update();

    expect(wrapper).toMatchSnapshot();

    username = wrapper.find('Link[data-target="username"]');
    expect(username.contains('Hannah')).toBe(true);

    const email = wrapper.find('a[data-target="email"]');
    expect(email.contains('hannah.werman@gmail.com')).toBe(true);

    const question = wrapper.find('h3[data-target="question"]');
    expect(question.contains('testing the context')).toBe(true);
  });
});
