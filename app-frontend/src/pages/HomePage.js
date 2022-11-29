import React from 'react';
import { connect } from 'react-redux';
import ReactGoogleCharts from '../components/ReactGoogleCharts';

import 'chart.js'

class HomePage extends React.Component {
  render() {
    let homePageContent = (
      <div data-testid="homepage">
        Welcome
      </div>
    )

    if (this.props.user.isLoggedIn) {
      homePageContent = (
        <div data-testid="homepage">
          Hello user
          <div>
            <ReactGoogleCharts/>
          </div>
        </div>
      )
    }

    return (
      <div data-testid="homepage">
        {homePageContent}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state
  }
}

export default connect(mapStateToProps)(HomePage);