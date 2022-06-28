import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'
import Modal from '../../components/Modal';
import Button from '../../components/Button';


function VehicleStatus() {
  const [vehicleList, setVehicleList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [isShowDetial, setIsShowDetail] = useState(-1);
  const [isShowSignOff, setIsShowSignOff] = useState(false);

  const [driverName, setDriverName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [license, setLicense] = useState('');
  const [druation, setDuration] = useState('');
  const [inboundDate, setInboundDate] = useState('');
  const [inboundTime, setInboundTime] = useState('');

  useEffect( () => {
    setStatusMessage('Please wait a moment till finish fetching the data from server.');
    axios.get(config.api + 'vehicle')
    .then( res => {
      setStatusMessage('Complete fetching the data from server.');
      setVehicleList(res.data);
    })
    .catch( err => {
      setStatusMessage('Error has occured while fetching the data.');
    });
  }, [])

  const editRow = (index) => {
    setIsShowDetail(index)
    setDriverName(vehicleList[index].inbound_driver_name);
    setCompanyName(vehicleList[index].inbound_company_name);
    setLicense(vehicleList[index].inbound_license);
    setDuration(vehicleList[index].inbound_driver_name);
    setInboundDate(vehicleList[index].inbound_date);
    setInboundTime(vehicleList[index].inbound_time);
  }
  
  return (
    <div>
      <TableLayout style={{width:'700px'}}>
        <TableHeader>
          <TableRow>
            <TableCell>Driver Name</TableCell>
            <TableCell>Company Name</TableCell>
            <TableCell>License Plate</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {
            vehicleList.length ?
            vehicleList.map( (item, index) => {
              return <TableRow key={index} onClick={ () => { editRow(index) } }>
                <TableCell>{item.inbound_driver_name}</TableCell>
                <TableCell>{item.inbound_company_name}</TableCell>
                <TableCell>{item.inbound_license}</TableCell>
                <TableCell>{item.inbound_driver_name}</TableCell>
              </TableRow>
            }) :
            null
          }
        </tbody>
      </TableLayout>
      {
        isShowDetial !== -1 ?
        <Modal
          show={isShowDetial!==-1}
          close={() => { setIsShowDetail(-1) }}
          okAction={null}
          cancelAction={null}
          okName='Save'
          cancelName='Cancel'>
          <TableLayout>
            <TableHeader>
              <TableRow>
                <TableCell>Driver Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>License Plate</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Inbound Date</TableCell>
                <TableCell>Inbound Time</TableCell>
                <TableCell>Sign Off</TableCell>
              </TableRow>
            </TableHeader>
            <tbody><tr>
              <TableCell><input value={driverName} onChange={(e)=>{setDriverName(e.target.value)}}/></TableCell>
              <TableCell><input value={companyName} onChange={(e)=>{setCompanyName(e.target.value)}}/></TableCell>
              <TableCell><input value={license} onChange={(e)=>{setLicense(e.target.value)}}/></TableCell>
              <TableCell><input value={druation} onChange={(e)=>{setDuration(e.target.value)}}/></TableCell>
              <TableCell><input value={inboundDate} onChange={(e)=>{setInboundDate(e.target.value)}}/></TableCell>
              <TableCell><input value={inboundTime} onChange={(e)=>{setInboundTime(e.target.value)}}/></TableCell>
              <TableCell><a onClick={ ()=> { setIsShowSignOff(true) } }>Sign Off</a></TableCell>
            </tr></tbody>
          </TableLayout>
          <Modal
            show={isShowSignOff}
            close={() => { setIsShowSignOff(false) }}
            okAction={()=> { setIsShowSignOff(false) }}
            cancelAction={()=> { setIsShowSignOff(false) }}
            okName='OK'
            cancelName='Cancel'>
            <div style={{padding: '10px'}}>Are you sure?</div>
          </Modal>
        </Modal>
        : null
      }
    </div>
  );
}

export default VehicleStatus;
