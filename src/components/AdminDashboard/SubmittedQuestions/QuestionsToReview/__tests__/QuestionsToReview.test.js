import React from 'react';
import { shallow } from 'enzyme';

import QuestionsToReview from '../index';

describe('<QuestionsToReview/>', () => {
    it('should render correctly and match snapshot', () => {
        const wrapper = shallow(<QuestionsToReview />);

        expect(wrapper).toMatchSnapshot()
    });

    it('should display the correct number of submitted questions', () => {
        const wrapper = shallow(<QuestionsToReview />);
        // setting the state, like in component did mount
        wrapper.setState({ num: 2 });
        wrapper.update();

        const counterDisplay = wrapper.find('div.counterDisplay');
        expect(parseInt(counterDisplay.text())).toEqual(2);
    });
});