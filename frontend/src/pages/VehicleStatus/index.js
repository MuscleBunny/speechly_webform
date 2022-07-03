import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import storage from '../../libs/storage'
import {useNavigate} from 'react-router-dom'


import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup,
} from "@speechly/react-ui";
import { VoiceInput, VoiceDatePicker } from "@speechly/react-voice-forms";


function VehicleStatus() {
  const navigate = useNavigate();
  const [vehicleList, setVehicleList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [detailIndex, setDetailIndex] = useState(-1);
  const [isShowSignOff, setIsShowSignOff] = useState(false);

  const { segment } = useSpeechContext();
  const [data, setData] = useState({
    driverName: '',
    companyName: '',
    license: '',
    druation: '',
    inboundDate: '',
    inboundTime: '',
    outboundDate: '',
    outboundTime: '',
    recordStatus: 0,
  });

  const handleChange = (e, key) => { setData({ ...data, [key]: e }) };

  useEffect(() => {
    if (segment) {
      if (segment.entities) {
        segment.entities.forEach((entity) => {
          console.log(entity.type, entity.value);
          setData((data) => ({ ...data, [entity.type]: entity.value }));
        });
      }
      if (segment.isFinal) {
        if (segment.entities) {
          segment.entities.forEach((entity) => {
            console.log("✅", entity.type, entity.value);
            setData((data) => ({ ...data, [entity.type]: entity.value }));
          });
        }
      }
    }
  }, [segment]);
  // const [driverName, setDriverName] = useState('');
  // const [companyName, setCompanyName] = useState('');
  // const [license, setLicense] = useState('');
  // const [druation, setDuration] = useState('');
  // const [inboundDate, setInboundDate] = useState('');
  // const [inboundTime, setInboundTime] = useState('');
  // const [outboundDate, setOutboundDate] = useState('');
  // const [outboundTime, setOutboundTime] = useState('');
  // const [recordStatus, setRecordStatus] = useState(0);

  useEffect( () => {
    const token = storage.get('token');
    if ( token === '' ) {
      navigate('/');
    }
    setStatusMessage('Please wait a moment till finish fetching the data from server.');
    axios.get(config.api + 'vehicle', {
      headers: {'Authorization': token}
    })
    .then( res => {
      setStatusMessage('Complete fetching the data from server.');
      setVehicleList(res.data);
    })
    .catch( err => {
      navigate('/');
      setStatusMessage('Error has occured while fetching the data.');
    });
  }, [])

  const editRow = (index) => {
    setDetailIndex(index)
    setData({
      driverName: vehicleList[index].inbound_driver_name,
      companyName:vehicleList[index].inbound_company_name,
      license:vehicleList[index].inbound_license,
      druation:vehicleList[index].calculated_duation_total,
      inboundDate:vehicleList[index].inbound_date,
      inboundTime:vehicleList[index].inbound_time,
      outboundDate:vehicleList[index].record_status,
      outboundTime:vehicleList[index].outbound_date,
      recordStatus:vehicleList[index].outbound_time,
    });
  }

  const saveRow = () => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'vehicle/update', {
      id: vehicleList[detailIndex].id,
      updates: {
        inbound_driver_name:data.driverName,
        inbound_company_name:data.companyName,
        inbound_license:data.license,
        calculated_duation_total:data.druation,
        inbound_date:data.inboundDate,
        inbound_time:data.inboundTime,
        record_status:data.recordStatus,
        outbound_date:data.outboundDate,
        outbound_time:data.outboundTime
      }
    })
    .then( res => {
      vehicleList[detailIndex].inbound_driver_name = data.driverName;
      vehicleList[detailIndex].inbound_company_name = data.companyName;
      vehicleList[detailIndex].inbound_license = data.license;
      vehicleList[detailIndex].calculated_duation_total = data.druation;
      vehicleList[detailIndex].inbound_date = data.inboundDate;
      vehicleList[detailIndex].inbound_time = data.inboundTime;
      vehicleList[detailIndex].record_status = data.recordStatus;
      vehicleList[detailIndex].outbound_date = data.outboundDate;
      vehicleList[detailIndex].outbound_time = data.outboundTime;
      setDetailIndex(-1);
      setStatusMessage('Complete Saving the data.');
    })
    .catch((err)=>{
      navigate('/');
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
          <BigTranscript placement="top" />
          <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
          <IntroPopup />
            <VoiceInput label='Driver Name' value={data.driverName} onChange={(e)=>{handleChange(e, 'driverName')}}/>
            <VoiceInput label='Company Name' value={data.companyName} onChange={(e)=>{handleChange(e, 'companyName')}}/>
            <VoiceInput label='License' value={data.license} onChange={(e)=>{handleChange(e, 'license')}}/>
            <VoiceInput label='Duration' value={data.druation} onChange={(e)=>{handleChange(e, 'druation')}}/>
            <VoiceInput label='Inbound Date' value={data.inboundDate} onChange={(e)=>{handleChange(e, 'inboundDate')}}/>
            <VoiceInput label='Inbound Time' value={data.inboundTime} onChange={(e)=>{handleChange(e, 'inboundTime')}}/>
            <Button onClick={ ()=> { setIsShowSignOff(true) } }>Sign Off</Button>
          <Modal
            show={isShowSignOff}
            close={() => { setIsShowSignOff(false) }}
            okAction={()=> { handleChange(1, 'outboundDate'); setIsShowSignOff(false); }}
            cancelAction={()=> { setIsShowSignOff(false) }}
            okName='OK'
            cancelName='Cancel'>
            <VoiceInput label='Date' value={data.outboundDate} onChange={(e)=>{handleChange(e, 'outboundDate')}}/>
            <VoiceInput label='Time' value={data.outboundTime} onChange={(e)=>{handleChange(e, 'outboundTime')}}/>
          </Modal>
        </Modal>
        : null
      }
    </div>
  );
}

export default VehicleStatus;
