import React from 'react';
import renderer from 'react-test-renderer';
import StudentHome from '../components/Courses/StudentViews/MyCourses';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('test to display courses if courses are present',() =>{
    test('renders course-items', () => {
        const courses = [{ course_id: 200, dept: 'SE' },
        { course_id: 204, dept: 'SE' } ];
        const wrapper = shallow(<StudentHome courses={courses}/>);
        // Expect the wrapper object to be defined
        expect(wrapper.find('CourseList')).toBeDefined();
      })
    });