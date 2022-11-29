/* eslint-disable react/react-in-jsx-scope */
import { configure, shallow } from 'enzyme';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import ResponsiveDrawer from './drawer';

configure({ adapter: new Adapter() });

describe(' Testing drawer button names visibility', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ResponsiveDrawer />);
  });

  test("render a button with text of 'User Management'", () => {
    expect(wrapper.find('#user-management').text()).toBe('User Management');
  });

  test("render a button with text of 'Customer'", () => {
    expect(wrapper.find('#customer').text()).toBe('Company');
  });

  test("render a button with text of 'User'", () => {
    expect(wrapper.find('#user').text()).toBe('User');
  });

  test("render a button with text of 'IOT'", () => {
    expect(wrapper.find('#IOT').text()).toBe('I O T');
  });

  test("render a button with text of 'Model'", () => {
    expect(wrapper.find('#iot-model').text()).toBe('Model');
  });

  test("render a button with text of 'Device'", () => {
    expect(wrapper.find('#iot-device').text()).toBe('Device');
  });

  test("render a button with text of 'Configuration'", () => {
    expect(wrapper.find('#iot-configuration').text()).toBe('Configuration');
  });

  test("render a button with text of 'Firmware'", () => {
    expect(wrapper.find('#iot-firmware').text()).toBe('Firmware');
  });

  test("render a button with text of 'M.H.E'", () => {
    expect(wrapper.find('#MHE').text()).toBe('M.H.E');
  });

  test("render a button with text of 'Model'", () => {
    expect(wrapper.find('#mhe-model').text()).toBe('Model');
  });

  test("render a button with text of 'Equipment'", () => {
    expect(wrapper.find('#mhe-equipment').text()).toBe('Equipment');
  });

  test("render a button with text of 'Dashboard'", () => {
    expect(wrapper.find('#dashboard').text()).toBe('Dashboard');
  });

  test("render a button with text of 'Dashboard Summary'", () => {
    expect(wrapper.find('#dash-summary').text()).toBe('Summary');
  });

  test("render a button with text of 'Dashboard Equipment-wise'", () => {
    expect(wrapper.find('#dash-equipment').text()).toBe('Equipment Wise');
  });

  test("render a button with text of 'Dashboard Map'", () => {
    expect(wrapper.find('#dash-map').text()).toBe('Map');
  });

  test("render a button with text of 'Alert Summary'", () => {
    expect(wrapper.find('#alert-summary').text()).toBe('Summary');
  });
});

describe(' Testing drawer button names visibility in mobile view drawer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ResponsiveDrawer />);
  });
  test("render a button with text 'User Management' in Mobile View", () => {
    expect(wrapper.find('#user-management-mv').text()).toBe('User Management');
  });

  test("render a button with text of 'Customer' in Mobile View", () => {
    expect(wrapper.find('#customer-mv').text()).toBe('Company');
  });

  test("render a button with text of 'User' in mobile View", () => {
    expect(wrapper.find('#user-mv').text()).toBe('User');
  });

  test("render a button with text of 'IOT' in mobile View", () => {
    expect(wrapper.find('#IOT-mv').text()).toBe('I O T');
  });

  test("render a button with text of 'Model' in mobile View", () => {
    expect(wrapper.find('#iot-model-mv').text()).toBe('Model');
  });

  test("render a button with text of 'Device' in mobile View", () => {
    expect(wrapper.find('#iot-device-mv').text()).toBe('Device');
  });

  test("render a button with text of 'Configuration' in mobile View", () => {
    expect(wrapper.find('#iot-configuration-mv').text()).toBe('Configuration');
  });

  test("render a button with text of 'Firmware' in mobile View", () => {
    expect(wrapper.find('#iot-firmware-mv').text()).toBe('Firmware');
  });

  test("render a button with text of 'M.H.E' in mobile View", () => {
    expect(wrapper.find('#MHE-mv').text()).toBe('M.H.E');
  });

  test("render a button with text of 'Model' in mobile View", () => {
    expect(wrapper.find('#mhe-model-mv').text()).toBe('Model');
  });

  test("render a button with text of 'Equipment' in mobile View", () => {
    expect(wrapper.find('#mhe-equipment-mv').text()).toBe('Equipment');
  });

  test("render a button with text of 'Dashboard' in mobile View", () => {
    expect(wrapper.find('#dashboard-mv').text()).toBe('Dashboard');
  });

  test("render a button with text of 'Dashboard Summary' in mobile View", () => {
    expect(wrapper.find('#dash-summary-mv').text()).toBe('Summary');
  });

  test("render a button with text of 'Dashboard Equipment-wise' in mobile View", () => {
    expect(wrapper.find('#dash-equipment-mv').text()).toBe('Equipment-wise');
  });

  test("render a button with text of 'Dashboard Map' in mobile View", () => {
    expect(wrapper.find('#dash-map-mv').text()).toBe('Map');
  });

  test("render a button with text of 'Alert Summary' in mobile View", () => {
    expect(wrapper.find('#alert-summary-mv').text()).toBe('Summary');
  });
});

//     test("render the initial value of state of div",()=>{
//         expect(wrapper.find("#counter-value").text()).toBe("0");

//   });

//   test("render click event of increment button and increment counter value",()=>{
//      wrapper.find("#increment-btn").simulate('click');
//       expect(wrapper.find("#counter-value").text()).toBe("1");

//   });

//    test("render click event of decrement button and increment counter value",()=>{
//         wrapper.find("#increment-btn").simulate('click');
//              expect(wrapper.find("#counter-value").text()).toBe("1");
//        wrapper.find("#decrement-btn").simulate('click');
//         expect(wrapper.find("#counter-value").text()).toBe("0");

//     });
