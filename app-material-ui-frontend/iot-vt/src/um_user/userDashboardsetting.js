// import * as React from 'react';
// import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
// import { DataGrid } from '@material-ui/data-grid';

// const useStyles = makeStyles((theme) => ({

//   content: {
//     flexGrow: 4,
//     padding: theme.spacing(3),
//     paddingLeft: '20%',
//     paddingTop: '0%',

//   },

// }));

// const columns = [
//   { field: 'id', headerName: 'Equipment Name', width: 200 },
//   { field: 'status', headerName: 'Status', width: 150 },
// ];

// const rows = [
//   { id: 'xyz', status: 'Active' },
//   { id: 'abc', status: 'InActive' },

// ];

// function UserDashboardSetting() {
//   const classes = useStyles();

//   return (
//     <main className={classes.content}>
//       <div style={{ paddingLeft: '1%' }}>
//         <Typography variant="h6" noWrap component="div">
//           Choose equipment to show on dashboard
//         </Typography>

//       </div>

//       <div style={{
//         height: 300, width: '100%', paddingLeft: '30%', paddingRight: '30%', paddingTop: '2%',
//       }}
//       >

//         <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />

//       </div>

//     </main>
//   );
// }
// export default UserDashboardSetting;
