import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import { UnwrappedQuestionSubmitForm } from '../QuestionSubmitForm';

const fakeAuthUser = {
    uid: 'GvM7fEkYp4fcaSuScwixV0xinfT2',
};

const fakeState = {
    qtext: 'this',
    a1text: 'is',
    a1correct: true,
    sources: 'test',
    atLeastOneChecked: true,
}

const isDisabled = (state) => {
    if (
      state.qtext === "" ||
      state.a1text === "" ||
      state.sources === "" ||
      state.atLeastOneChecked === false
    ) {
      return true;
    } else {
      return false;
    }
  }

describe('<QuestionSubmitForm />', () => {
    it('should render correctly and match snapshot', () => {
        const wrapper = mount(
            <Router>
                <UnwrappedQuestionSubmitForm authUser={fakeAuthUser}/>
            </Router>
        )
        expect(wrapper).toMatchSnapshot();
    });

    it('button should not be clickable if state is empty', () => {
        const wrapper = mount(
            <Router>
                <UnwrappedQuestionSubmitForm authUser={fakeAuthUser}/>
            </Router>
        )

        const button = wrapper.find('Button#form-submit');
        expect(button.props().disabled).toBe(true);
    });

    it('button should be clickable if required fields are filled', async () => {
        const wrapper = mount(
            <Router>
                <UnwrappedQuestionSubmitForm authUser={fakeAuthUser}/>
            </Router>
        )

        const button = wrapper.find('Button#form-submit');
        button.props().isDisabled = isDisabled;
        wrapper.setState(fakeState)

        expect(button.props().isDisabled(wrapper.state())).toBe(false)
    })
})
