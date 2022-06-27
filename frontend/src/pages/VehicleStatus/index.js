import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'
import Modal from '../../components/Modal';


function VehicleStatus() {
  const [vehicleList, setVehicleList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [isShowDetial, setIsShowDetail] = useState(-1);

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
  return (
    <div>
      <TableLayout>
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
              return <TableRow key={index} onClick={()=>{ setIsShowDetail(index) }}>
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
        <Modal>
          <div>asdfasdf</div>
        </Modal>
        : null
      }
    </div>
  );
}

export default VehicleStatus;
