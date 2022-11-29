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
import EquipmentWiseAlertKRCL from './alert_equipment_wise/equipmentWiseAlertKRCL';
import AlertKRCLSummaryDash from './alert_summary/alertKRCLSummaryDash';
import './App.css';
import EquipmentWiseKRCL from './dash_equipment/equipmentWiseKRCL';
import SummaryKRCL from './dash_summary/summaryKRCL.js';

function RouterKRCL() {
  return (

             <Router>

                <Switch>

                   <Route exact path="/alert_summary/alertKRCLSummaryDash" component={AlertKRCLSummaryDash} />

                   <Route exact path="/alert_equipment_wise/equipmentWiseAlertKRCL" component={EquipmentWiseAlertKRCL} />

                   <Route exact path="/dash_summary/summaryKRCL" component={SummaryKRCL} />

                   <Route exact path="/dash_equipment/equipmentWiseKRCL" component={EquipmentWiseKRCL} />

                </Switch>
             </Router>

  );
}

export default RouterKRCL;
