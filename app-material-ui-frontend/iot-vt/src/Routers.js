/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-as-default */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/react-in-jsx-scope */
// import {
//   HashRouter, BrowserRouter as Router, Route, Switch,
// } from 'react-router-dom';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import User from './um_user/user';

import Mhemodel from './mhe_model/mhemodel';
import MheEquipment from './mhe_equipment/mheequipment';

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

import MheEquipmentAddNew from './mhe_equipment/mheEquipmentAddNew';
import MheEquipmentEdit from './mhe_equipment/mheEquipmentEdit';

import MheEquipmentAddSensorMapping from './mhe_equipment/mheEquipmentAddSensorMapping';

import EquipmentWiseAlert from './alert_equipment_wise/EquipmentWiseAlert';
import IotAddNewModelEdit from './iot_model/iotAddNewModelEdit';
import IotModelEdit from './iot_model/iotModelEdit';
import IotAddSensorMapping from './iot_model/iotAddSensorMapping';
import IotEditSensorMapping from './iot_model/iotEditSensorMapping';
import IotAddNewDevices from './iot_device/iotAddNewDevices';
import IotDeviceEdit from './iot_device/iotDeviceEdit';
import IotDeviceEditAddUser from './iot_device/iotDeviceEditAddUser';
import IotAddNewDevicesAddUser from './iot_device/iotAddNewDevicesAddUser';
import deviceAddNew from './iot_device/deviceAddNew';
import EditDeviceData from './iot_device/EditDeviceData';

import MheModelEdit from './mhe_model/mhemodeledit';
import UserEquipmentAccess from './um_user/userEquipmentAccess';
import UserCompanyEdit from './um_user/UserCompanyEdit';
import UserEquipmentEdit from './um_user/UserEquipmentEdit';
import EditUserData from './um_user/EditUserData';

import CompanyTable from './um_company/CompanyTable';
import CompanyAdd from './um_company/companyAdd';
import CompanyEdit from './um_company/companyEdit';
import CompAddEditUser from './um_company/compAddEditUser';
import CompEquipmentAccess from './um_company/CompEquipmentAccess';
import CompEquipmentEditAccess from './um_company/compEquipmentEditAccess';
import CompEditAddUser from './um_company/compEditAddUser';
import CompEditUserEditIcon from './um_company/compEditUserEditIcon';
import EditCompanyData from './um_company/EditCompanyData';

import MheEditSpecification from './mhe_equipment/MheEditSpecification';
import MheModelAdd from './mhe_model/MheModelAdd';
import MheSpecificationmodel from './mhe_model/MheSpecificationmodel';
import MheSpecificationAdd from './mhe_model/MheSpecificationAdd';
import MheSpecificationEdit from './mhe_model/MheSpecificationEdit';
// import Register from './components/register';

// import Dashboard_Cust from './components/dashboard_Cust';
import EquipmentWise from './dash_equipment/equipmentWise';

// import EquipmentWiseCust from './dash_equipment/equipmentWiseCust';

// import AlertSummaryCust from './alert_summary/alertSummaryCust';
import SummaryDashboard from './dash_summary/SummaryDashboard';

import Test from './dash_equipment/test';
import CompanyAddUserDataGrid from './um_company/companyAddUserDataGrid';

import Landingpage from './dash_summary/Landingpage';
import Devices from './dash_summary/Devices';
// import EquipmentWiseAlertCust from './alert_equipment_wise/equipmentWiseAlertCust';
import Inactivedevices from './dash_summary/Inactivedevices';
import Inactivesensors from './dash_summary/Inactivesensors';
import AlertsDonutChart from './alert_summary/AlertsDonutChart';
import AlertsDevices from './alert_summary/AlertsDevices';
import AlertsDataTable from './alert_summary/AlertsDataTable';
import Table from './um_company/CompanyTable';
import AddService from './device_service/AddService';
import deviceSeviceEdit from './device_service/deviceServiceEdit';
import Service from './device_service/Service';
import iotSensorTable from './iot_model/iotSensorTable';
import AddSensorForm from './iot_model/AddSensorForm';
import EditSensorForm from './iot_model/EditSensorForm';
import EquipmentAlertEdit from './alert_equipment_wise/EquipmentAlertEdit';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';

function Routers() {
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/register" component={Register} /> */}

        {/* <Route exact path="/dashboard_Cust" component={Dashboard_Cust} /> */}
        <Route
          exact
          path="/components/ProfileEdit/:email"
          component={ProfileEdit}
        />
        <Route
          exact
          path="/device_service/deviceServiceEdit.js/:deviceName"
          component={deviceSeviceEdit}
        />
        <Route
          exact
          path="/components/Profile.js"
          component={Profile}
        />
        <Route exact path="/device_service/Service.js" component={Service} />
        <Route
          exact
          path="/device_service/AddService.js"
          component={AddService}
        />

        <Route exact path="/um_company/companyTable.js" component={CompanyTable} />
        <Route exact path="/um_company/companyAdd.js" component={CompanyAdd} />
        <Route
          exact
          path="/um_company/companyEdit.js"
          component={CompanyEdit}
        />
        <Route
          exact
          path="/um_company/compAddEditUser.js"
          component={CompAddEditUser}
        />
        <Route
          exact
          path="/um_company/compEquipmentAccess.js"
          component={CompEquipmentAccess}
        />
        <Route
          exact
          path="/um_company/compEquipmentEditAccess.js"
          component={CompEquipmentEditAccess}
        />
        <Route
          exact
          path="/um_company/compEditAddUser.js"
          component={CompEditAddUser}
        />
        <Route
          exact
          path="/um_company/compEditUserEditIcon.js"
          component={CompEditUserEditIcon}
        />
        <Route
          exact
          path="/um_company/companyAddUserDataGrid.js"
          component={CompanyAddUserDataGrid}
        />
        <Route
          exact
          path="/um_company/compEquipmentEditAccess.js"
          component={CompEquipmentEditAccess}
        />
        <Route exact path="/um_company/companyDataTable" component={Table} />
        <Route
          exact
          path="/um_company/EditCompanyData/:id"
          component={EditCompanyData}
        />
        <Route exact path="/um_user/user.js" component={User} />
        <Route exact path="/um_user/userAddnew.js" component={UserAddnew} />
        <Route exact path="/um_user/userEdituser.js" component={UserEditUser} />
        <Route
          exact
          path="/um_user/userDashboardsetting.js"
          component={UserDashboardSetting}
        />
        <Route
          exact
          path="/um_user/userAddNewAddCompany.js"
          component={UserAddNewAddCompany}
        />
        <Route
          exact
          path="/um_user/userEquipmentAccess.js"
          component={UserEquipmentAccess}
        />
        <Route
          exact
          path="/um_user/UserCompanyEdit.js"
          component={UserCompanyEdit}
        />
        <Route
          exact
          path="/um_user/UserEquipmentEdit.js"
          component={UserEquipmentEdit}
        />
        <Route
          exact
          path="/um_user/EditUserData/:email"
          component={EditUserData}
        />

        <Route
          exact
          path="/um_user/EditUserData.js"
          component={UserEquipmentEdit}
        />

        <Route exact path="/iot_model/iotModel.js" component={IotModel} />
        <Route
          exact
          path="/iot_model/iotAddNewModel.js"
          component={IotAddNewModel}
        />
        <Route
          exact
          path="/iot_model/iotAddNewModelEdit.js"
          component={IotAddNewModelEdit}
        />
        <Route
          exact
          path="/iot_model/iotModelEdit.js"
          component={IotModelEdit}
        />
        <Route
          exact
          path="/iot_model/iotAddSensorMapping.js"
          component={IotAddSensorMapping}
        />
        <Route
          exact
          path="/iot_model/iotEditSensorMapping.js"
          component={IotEditSensorMapping}
        />
        <Route
          exact
          path="/iot_model/iotSensorTable/:id"
          component={iotSensorTable}
        />
        <Route
          exact
          path="/iot_model/AddSensorForm/:id"
          component={AddSensorForm}
        />

        <Route
          exact
          path="/iot_model/EditSensorForm/:sensorId/:modelId"
          component={EditSensorForm}
        />

        <Route exact path="/iot_device/iotDevices.js" component={IotDevices} />
        <Route
          exact
          path="/iot_device/iotAddNewDevices.js"
          component={IotAddNewDevices}
        />
        <Route
          exact
          path="/iot_device/iotDeviceEdit.js"
          component={IotDeviceEdit}
        />
        <Route
          exact
          path="/iot_device/iotDeviceEditAddUser.js"
          component={IotDeviceEditAddUser}
        />
        <Route
          exact
          path="/iot_device/iotAddNewDevicesAddUser.js"
          component={IotAddNewDevicesAddUser}
        />
        <Route
          exact
          path="/iot_device/deviceAddNew.js"
          component={deviceAddNew}
        />
        <Route
          exact
          path="/iot_device/EditDeviceData/:deviceName"
          component={EditDeviceData}
        />

        <Route
          exact
          path="/iot_configration/Configuration.js"
          component={Configuration}
        />

        <Route exact path="/iot_firmware/Firmware.js" component={Firmware} />
        <Route
          exact
          path="/iot_firmware/FirmwareAdd.js"
          component={FirmwareAdd}
        />
        <Route
          exact
          path="/iot_firmware/FirmwareEdit.js"
          component={FirmwareEdit}
        />

        <Route exact path="/mhe_model/mhemodel.js" component={Mhemodel} />
        <Route
          exact
          path="/mhe_model/mhemodeledit.js/:mheModelName"
          component={MheModelEdit}
        />
        <Route exact path="/mhe_model/MheModelAdd.js" component={MheModelAdd} />
        <Route
          exact
          path="/mhe_model/MheSpecificationmodel.js"
          component={MheSpecificationmodel}
        />
        <Route
          exact
          path="/mhe_model/MheSpecificationAdd.js"
          component={MheSpecificationAdd}
        />
        <Route
          exact
          path="/mhe_model/MheSpecificationEdit.js"
          component={MheSpecificationEdit}
        />

        <Route
          exact
          path="/mhe_equipment/mheequipment.js"
          component={MheEquipment}
        />
        <Route
          exact
          path="/mhe_equipment/mheEquipmentAddNew.js"
          component={MheEquipmentAddNew}
        />
        <Route
          exact
          path="/mhe_equipment/mheEquipmentEdit.js/:mheEquipmentName"
          component={MheEquipmentEdit}
        />
        <Route
          exact
          path="/mhe_equipment/mheEquipmentAddSensorMapping.js"
          component={MheEquipmentAddSensorMapping}
        />
        <Route
          exact
          path="/mhe_equipment/MheEditSpecification.js"
          component={MheEditSpecification}
        />

        {/* <Route exact path="/alert_summary/alertSummaryCust" component={AlertSummaryCust} /> */}

        <Route
          exact
          path="/alert_summary/summary.js"
          component={Alert_Summary}
        />

        <Route
          exact
          path="/alert_equipment_wise/EquipmentWiseAlert.js"
          component={EquipmentWiseAlert}
        />

        <Route
          exact
          path="/alert_equipment_wise/EquipmentAlertEdit.js/:id"
          component={EquipmentAlertEdit}
        />

        {/* <Route exact path="/alert_equipment_wise/equipmentWiseAlertCust" component={EquipmentWiseAlertCust} /> */}

        <Route
          exact
          path="/dash_summary/summaryDashboard.js"
          component={SummaryDashboard}
        />
        <Route
          exact
          path="/dash_summary/Landingpage.js"
          component={Landingpage}
        />
        <Route
          exact
          path="/dash_summary/Inactivedevices.js"
          component={Inactivedevices}
        />
        <Route
          exact
          path="/dash_summary/Inactivedevices/sensors/:id"
          component={Inactivesensors}
        />

        <Route
          exact
          path="/dash_summary/Inactivedevices/sensors/:id/:name"
          component={Inactivesensors}
        />

        <Route
          exact
          path="/dash_summary/ActiveDevices/sensors/:id/:name"
          component={Inactivesensors}
        />
        <Route
          exact
          path="/dash_summary/ActiveDevices.js"
          component={Devices}
        />

        <Route
          exact
          path="/alert_summary/AlertsDonutChart"
          component={AlertsDonutChart}
        />
        <Route
          exact
          path="/alert_summary/AlertsDevices/:type"
          component={AlertsDevices}
        />
        <Route
          exact
          path="/alert_summary/ProductionAlertsDevices/:type"
          component={AlertsDevices}
        />
        <Route
          exact
          path="/alert_summary/ConditionAlertsDevices/:type"
          component={AlertsDevices}
        />
        <Route
          exact
          path="/alert_summary/AlertsDataTable/:id/:type"
          component={AlertsDataTable}
        />

        {/* <Route exact path="/dash_equipment/equipmentWiseCust" component={EquipmentWiseCust} /> */}
        <Route
          exact
          path="/dash_equipment/equipmentWise.js"
          component={EquipmentWise}
        />

        <Route exact path="/dash_equipment/test.js" component={Test} />
      </Switch>
    </Router>
  );
}

export default Routers;
