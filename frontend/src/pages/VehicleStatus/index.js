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
  
  const [detailIndex, setDetailIndex] = useState(-1);
  const [isShowSignOff, setIsShowSignOff] = useState(false);

  const [driverName, setDriverName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [license, setLicense] = useState('');
  const [druation, setDuration] = useState('');
  const [inboundDate, setInboundDate] = useState('');
  const [inboundTime, setInboundTime] = useState('');
  const [outboundDate, setOutboundDate] = useState('');
  const [outboundTime, setOutboundTime] = useState('');
  const [recordStatus, setRecordStatus] = useState(0);

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
    setDetailIndex(index)
    setDriverName(vehicleList[index].inbound_driver_name);
    setCompanyName(vehicleList[index].inbound_company_name);
    setLicense(vehicleList[index].inbound_license);
    setDuration(vehicleList[index].calculated_duation_total);
    setInboundDate(vehicleList[index].inbound_date);
    setInboundTime(vehicleList[index].inbound_time);
    setRecordStatus(vehicleList[index].record_status);
  }

  const saveRow = () => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'vehicle/update', {
      id: vehicleList[detailIndex].id,
      updates: {
        inbound_driver_name:driverName,
        inbound_company_name:companyName,
        inbound_license:license,
        calculated_duation_total:druation,
        inbound_date:inboundDate,
        inbound_time:inboundTime,
        record_status:recordStatus,
        outbound_date:outboundDate,
        outbound_time:outboundTime
      }
    })
    .then( res => {
      setDetailIndex(-1);
      setStatusMessage('Complete Saving the data.');
    })
    .catch((err)=>{
      setStatusMessage('Error has occured while Saving the data.');
    });
  }
  
  return (
    <div>
      <p>{statusMessage}</p>
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
                <TableCell>{item.calculated_duation_total}</TableCell>
              </TableRow>
            }) :
            null
          }
        </tbody>
      </TableLayout>

      {
        detailIndex !== -1 ?
        <Modal
          show={detailIndex!==-1}
          close={() => { setDetailIndex(-1) }}
          okAction={saveRow}
          cancelAction={() => { setDetailIndex(-1) }}
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
            okAction={()=> { setRecordStatus(1); setIsShowSignOff(false); }}
            cancelAction={()=> { setIsShowSignOff(false) }}
            okName='OK'
            cancelName='Cancel'>
            <div><span>Date : </span><input value={outboundDate} onChange={(e)=>{setOutboundDate(e.target.value)}}/></div>
            <div>Time : <input value={outboundTime} onChange={(e)=>{setOutboundTime(e.target.value)}}/></div>
          </Modal>
        </Modal>
        : null
      }
    </div>
  );
}

export default VehicleStatus;
