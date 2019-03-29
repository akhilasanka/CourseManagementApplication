import React from 'react';
import renderer from 'react-test-renderer';
import NewCourse from '../components/Courses/FacultyViews/NewCourse'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });


describe('NewCourse', () => {
    it('should render correctly', () => {
      const component = shallow(<NewCourse />);
    
      expect(component).toMatchSnapshot();
    });
  });