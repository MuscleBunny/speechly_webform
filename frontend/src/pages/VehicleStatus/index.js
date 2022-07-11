import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import storage from '../../libs/storage'
import MainLayout from '../../layout/MainLayout';
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBuilding, faClock, faFont, faSortAmountAsc, faSortAmountDesc } from '@fortawesome/free-solid-svg-icons'
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup,
} from "@speechly/react-ui";
import { VoiceInput, VoiceDatePicker } from "@speechly/react-voice-forms";

Date.prototype.getCustomDate = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');
};

Date.prototype.getCustomTime = function() {
  var hh = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();

  return [
          (hh>9 ? '' : '0') + hh,
          (mm>9 ? '' : '0') + mm,
          (ss>9 ? '' : '0') + ss
         ].join(':');
};

function VehicleStatus() {
  const navigate = useNavigate();
  const [vehicleList, setVehicleList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [detailIndex, setDetailIndex] = useState(-1);
  const [isShowSignOff, setIsShowSignOff] = useState(false);

  const [sortValue, setSortValue] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);

  const { segment } = useSpeechContext();
  const [data, setData] = useState({
    ...vehicleList[0]
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

  useEffect( () => {
    const newArray = [...vehicleList.sort( (a, b) => {
      const aSort = a[sortValue];
      const bSort = b[sortValue];
      if ( aSort < bSort )
        return sortOrder*1;
      if ( aSort > bSort )
        return sortOrder*(-1);
      return 0;
    })]
    setVehicleList(newArray);
  }, [sortValue, sortOrder])

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
      setSortValue('calculated_duration');
    })
    .catch( err => {
      navigate('/');
      setStatusMessage('Error has occured while fetching the data.');
    });
  }, [])

  const editRow = (index) => {
    setDetailIndex(index)
    setData({
      ...vehicleList[index],
      inbound_date: new Date(vehicleList[index].inbound_date),
      outbound_date: vehicleList[index].outbound_date?(new Date(vehicleList[index].outbound_date)):(new Date())
    });
  }

  const addRow = () => {
    setDetailIndex(-2)
    const date = new Date();
    setData({
      inbound_guard_name: storage.get('user'),
      inbound_driver_name: '',
      inbound_company_name: '',
      inbound_date: date,
      inbound_time: date.getCustomTime(),
      inbound_license: '',
      inbound_destination: ''
    });
  }

  const saveRow = () => {
    const token = storage.get('token');
    setStatusMessage('Please wait.');
    
    axios.post(config.api + 'vehicle/update', {
      id: vehicleList[detailIndex].id,
      updates: {
        ...data,
        inbound_date: data.inbound_date.getCustomDate(),
        outbound_date: (data.outbound_date)?(data.outbound_date.getCustomDate()):''
      }
    }, {
      headers: {'Authorization': token}
    })
    .then( res => {
      let newVehicleList = [...vehicleList];
      setDetailIndex(-1);
      setStatusMessage('Complete Saving the data.');
      newVehicleList[detailIndex] = data;
      if ( data.record_status === 2 ) {
        newVehicleList = [...newVehicleList.slice(0, detailIndex), ...newVehicleList.slice(detailIndex+1)];
      }
      setVehicleList([...newVehicleList]);
      setData({});
    })
    .catch((err)=>{
      navigate('/');
      setStatusMessage('Error has occured while Saving the data.');
    });
  }

  const insertRow = () => {
    const token = storage.get('token');
    setStatusMessage('Please wait.');
    axios.post(config.api + 'vehicle/insert', {
      ...data,
      inbound_date: data.inbound_date.getCustomDate()
    }, {
      headers: {'Authorization': token}
    })
    .then( res => {
      console.log('new', res);
      data.id = res.data.insertId;
      var newArray = [...vehicleList, data];
      setVehicleList(newArray);
      setData({});
      setDetailIndex(-1);
      setStatusMessage('Complete Saving the data.');
    })
    .catch((err)=>{
      navigate('/');
      setStatusMessage('Error has occured while Saving the data.');
    });
  }

  const sortHandle = (value) => {
    if ( sortValue === value )
      setSortOrder(sortOrder*-1);
    else
      setSortOrder(1);
    setSortValue(value);
  }

  const showSignOffModal = () => {
    const date = new Date();
    setIsShowSignOff(true);
    setData( {
      ...data,
      outbound_guard_name: storage.get('user'),
      outbound_date: date,
      outbound_time: date.getCustomTime(),
    })
  }
  
  return (
    <MainLayout>
      <p>{statusMessage}</p>
      <div className='table-menu'>
        <div className='table-left-menu'>
          <Button className='primary-button' onClick={addRow}>Add New</Button>
        </div>
        <div className='table-right-menu'>
          <span>Sort by : </span>
          <a onClick={() => sortHandle('inbound_driver_name')}><FontAwesomeIcon icon={faUser} /></a>
          <a onClick={() => sortHandle('inbound_company_name')}><FontAwesomeIcon icon={faBuilding} /></a>
          <a onClick={() => sortHandle('inbound_license')}><FontAwesomeIcon icon={faFont} /></a>
          <a onClick={() => sortHandle('calculated_duration')}><FontAwesomeIcon icon={faClock} /></a>
        </div>
      </div>
      <div style={{clear:'both'}}></div>
      <TableLayout>
        <TableHeader>
          <TableRow>
            <TableCell>Driver Name{sortValue==='inbound_driver_name'?<FontAwesomeIcon icon={sortOrder===1?faSortAmountAsc:faSortAmountDesc} />:''}</TableCell>
            <TableCell>Company Name{sortValue==='inbound_company_name'?<FontAwesomeIcon icon={sortOrder===1?faSortAmountAsc:faSortAmountDesc} />:''}</TableCell>
            <TableCell>License Plate{sortValue==='inbound_license'?<FontAwesomeIcon icon={sortOrder===1?faSortAmountAsc:faSortAmountDesc} />:''}</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Duration{sortValue==='calculated_duration'?<FontAwesomeIcon icon={sortOrder===1?faSortAmountAsc:faSortAmountDesc} />:''}</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {
            vehicleList.length ?
            vehicleList.map( (item, index) => {
              return <TableRow className={index%2===0?'row-odd':'row-even'} key={index} onClick={ () => { editRow(index) } }>
                <TableCell className={sortValue==='inbound_driver_name'?'main-col':''}>{item.inbound_driver_name}</TableCell>
                <TableCell className={sortValue==='inbound_company_name'?'main-col':''}>{item.inbound_company_name}</TableCell>
                <TableCell className={sortValue==='inbound_license'?'main-col':''}>{item.inbound_license}</TableCell>
                <TableCell>{item.inbound_destination}</TableCell>
                <TableCell className={'last ' + (sortValue==='calculated_duration'?'main-col':'')}>{item.calculated_duration}</TableCell>
              </TableRow>
            }) :
            null
          }
        </tbody>
      </TableLayout>

      {
        detailIndex !== -1 ?
        <Modal
          title={detailIndex>=0?'Edit Vehicle Record':'Sign on New Vehicle'}
          show={detailIndex!==-1}
          close={() => { setDetailIndex(-1) }}
          okAction={detailIndex>=0?saveRow:insertRow}
          cancelAction={() => { setDetailIndex(-1) }}
          okName='Save'
          cancelName='Cancel'>
          <BigTranscript placement="top" />
          <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
          <IntroPopup />
            <VoiceInput label='Guard Name' value={data.inbound_guard_name} onChange={(e)=>{handleChange(e, 'inbound_guard_name')}}/>
            <VoiceInput label='Driver Name' value={data.inbound_driver_name} onChange={(e)=>{handleChange(e, 'inbound_driver_name')}}/>
            <VoiceInput label='Company Name' value={data.inbound_company_name} onChange={(e)=>{handleChange(e, 'inbound_company_name')}}/>
            <VoiceInput label='License' value={data.inbound_license} onChange={(e)=>{handleChange(e, 'inbound_license')}}/>
            <VoiceInput label='Destination' value={data.inbound_destination} onChange={(e)=>{handleChange(e, 'inbound_destination')}}/>
            {/* <VoiceInput label='Duration' value={data.calculated_duration} onChange={(e)=>{handleChange(e, 'calculated_duration')}}/> */}
            <VoiceDatePicker label='Inbound Date' value={data.inbound_date} onChange={(e)=>{handleChange(e, 'inbound_date')}}/>
            <VoiceInput label='Inbound Time' value={data.inbound_time} onChange={(e)=>{handleChange(e, 'inbound_time')}}/>
            {detailIndex!==-2?<Button className='info-button' onClick={ showSignOffModal }>Sign Off this vehicle</Button>:''}
          <Modal
            title='Sign Off Vehicle'
            show={isShowSignOff}
            close={() => { setIsShowSignOff(false) }}
            okAction={()=> { handleChange(2, 'record_status'); setIsShowSignOff(false); }}
            cancelAction={()=> { setIsShowSignOff(false) }}
            okName='OK'
            cancelName='Cancel'>
            <VoiceInput label='Name' value={data.outbound_guard_name} onChange={(e)=>{handleChange(e, 'outbound_guard_name')}}/>
            <VoiceDatePicker label='Date' value={data.outbound_date} onChange={(e)=>{handleChange(e, 'outbound_date')}}/>
            <VoiceInput label='Time' value={data.outbound_time} onChange={(e)=>{handleChange(e, 'outbound_time')}}/>
          </Modal>
        </Modal>
        : null
      }
    </MainLayout>
  );
}

export default VehicleStatus;
