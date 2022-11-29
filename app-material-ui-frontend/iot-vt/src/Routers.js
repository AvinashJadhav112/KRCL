/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/react-in-jsx-scope */

import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom';
import './App.css';
import User from './um_user/user';
import UserAddnew from './um_user/userAddnew';
import UserEditUser from './um_user/userEdituser';
import UserDashboardSetting from './um_user/userDashboardsetting';
import UserAddNewAddCompany from './um_user/userAddNewAddCompany';
import Configuration from './iot_configuration/Configuration';
import Firmware from './iot_firmware/Firmware';
import FirmwareAdd from './iot_firmware/FirmwareAdd';
import FirmwareEdit from './iot_firmware/FirmwareEdit';
import IotModel from './iot_model/iotModel';
import IotAddNewModel from './iot_model/iotAddNewModel';
import IotDevices from './iot_device/iotDevices';
import Alert_Summary from './alert_summary/summary';
import EquipmentWiseAlert from './alert_equipment_wise/EquipmentWiseAlert';
import IotAddNewModelEdit from './iot_model/iotAddNewModelEdit';
import IotModelEdit from './iot_model/iotModelEdit';
import IotAddSensorMapping from './iot_model/iotAddSensorMapping';
import IotEditSensorMapping from './iot_model/iotEditSensorMapping';
import IotAddNewDevices from './iot_device/iotAddNewDevices';
import IotDeviceEdit from './iot_device/iotDeviceEdit';
import IotDeviceEditAddUser from './iot_device/iotDeviceEditAddUser';
import IotAddNewDevicesAddUser from './iot_device/iotAddNewDevicesAddUser';
import UserEquipmentAccess from './um_user/userEquipmentAccess';
import UserCompanyEdit from './um_user/UserCompanyEdit';
import UserEquipmentEdit from './um_user/UserEquipmentEdit';
import Company from './um_company/company';
import CompanyAdd from './um_company/companyAdd';
import CompanyEdit from './um_company/companyEdit';
import CompAddEditUser from './um_company/compAddEditUser';
import CompEquipmentAccess from './um_company/CompEquipmentAccess';
import CompEquipmentEditAccess from './um_company/compEquipmentEditAccess';
import CompEditAddUser from './um_company/compEditAddUser';
import CompEditUserEditIcon from './um_company/compEditUserEditIcon';
import EquipmentWise from './dash_equipment/equipmentWise';
import SummaryDashboard from './dash_summary/SummaryDashboard';
import Test from './dash_equipment/test';
import CompanyAddUserDataGrid from './um_company/companyAddUserDataGrid';

function Routers() {
  return (

           <Router>

              <Switch>
                 <Route exact path="/um_company/company.js" component={Company} />
                 <Route exact path="/um_company/companyAdd.js" component={CompanyAdd} />
                 <Route exact path="/um_company/companyEdit.js" component={CompanyEdit} />
                 <Route exact path="/um_company/compAddEditUser.js" component={CompAddEditUser} />
                 <Route exact path="/um_company/compEquipmentAccess.js" component={CompEquipmentAccess} />
                 <Route exact path="/um_company/compEquipmentEditAccess.js" component={CompEquipmentEditAccess} />
                 <Route exact path="/um_company/compEditAddUser.js" component={CompEditAddUser} />
                 <Route exact path="/um_company/compEditUserEditIcon.js" component={CompEditUserEditIcon} />
                 <Route exact path="/um_company/companyAddUserDataGrid.js" component={CompanyAddUserDataGrid} />
                 <Route exact path="/um_company/compEquipmentEditAccess.js" component={CompEquipmentEditAccess} />

                 <Route exact path="/um_user/user.js" component={User} />
                 <Route exact path="/um_user/userAddnew.js" component={UserAddnew} />
                 <Route exact path="/um_user/userEdituser.js" component={UserEditUser} />
                 <Route exact path="/um_user/userDashboardsetting.js" component={UserDashboardSetting} />
                 <Route exact path="/um_user/userAddNewAddCompany.js" component={UserAddNewAddCompany} />
                 <Route exact path="/um_user/userEquipmentAccess.js" component={UserEquipmentAccess} />
                 <Route exact path="/um_user/UserCompanyEdit.js" component={UserCompanyEdit} />
                 <Route exact path="/um_user/UserEquipmentEdit.js" component={UserEquipmentEdit} />

                 <Route exact path="/iot_model/iotModel.js" component={IotModel} />
                 <Route exact path="/iot_model/iotAddNewModel.js" component={IotAddNewModel} />
                 <Route exact path="/iot_model/iotAddNewModelEdit.js" component={IotAddNewModelEdit} />
                 <Route exact path="/iot_model/iotModelEdit.js" component={IotModelEdit} />
                 <Route exact path="/iot_model/iotAddSensorMapping.js" component={IotAddSensorMapping} />
                 <Route exact path="/iot_model/iotEditSensorMapping.js" component={IotEditSensorMapping} />

                 <Route exact path="/iot_device/iotDevices.js" component={IotDevices} />
                 <Route exact path="/iot_device/iotAddNewDevices.js" component={IotAddNewDevices} />
                 <Route exact path="/iot_device/iotDeviceEdit.js" component={IotDeviceEdit} />
                 <Route exact path="/iot_device/iotDeviceEditAddUser.js" component={IotDeviceEditAddUser} />
                 <Route exact path="/iot_device/iotAddNewDevicesAddUser.js" component={IotAddNewDevicesAddUser} />

                 <Route exact path="/iot_configration/Configuration.js" component={Configuration} />

                 <Route exact path="/iot_firmware/Firmware.js" component={Firmware} />
                 <Route exact path="/iot_firmware/FirmwareAdd.js" component={FirmwareAdd} />
                 <Route exact path="/iot_firmware/FirmwareEdit.js" component={FirmwareEdit} />

                 <Route exact path="/alert_summary/summary.js" component={Alert_Summary} />

                 <Route exact path="/alert_equipment_wise/EquipmentWiseAlert.js" component={EquipmentWiseAlert} />

                 <Route exact path="/dash_summary/summaryDashboard.js" component={SummaryDashboard} />

                 <Route exact path="/dash_equipment/equipmentWise.js" component={EquipmentWise} />

                 <Route exact path="/dash_equipment/test.js" component={Test} />

              </Switch>
           </Router>

  );
}

export default Routers;
