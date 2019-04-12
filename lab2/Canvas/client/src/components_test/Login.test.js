import React from 'react';
import renderer from 'react-test-renderer';
import { Login } from '../components/LoginAndSignup/Login';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('Test case to signin as student if checkbox is not checked',() =>{
    let wrapper;
    test('login as student if checkbox unchecked',()=>{
    wrapper = shallow(<Login/>);
    wrapper.find('input[type="checkbox"]').simulate('change', {target: {name: 'isFaculty', value: 'student'}});
    wrapper.find('input[type="submit"]').simulate('click');
    expect(wrapper.state('isFaculty')).toEqual(null);
    })
    });