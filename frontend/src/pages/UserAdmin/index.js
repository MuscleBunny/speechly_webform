import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'
import storage from '../../libs/storage'
import {useNavigate} from 'react-router-dom'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { useSpeechContext } from "@speechly/react-client";
import MainLayout from '../../layout/MainLayout';
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup,
} from "@speechly/react-ui";
import { VoiceInput } from "@speechly/react-voice-forms";

function UserAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState([]);
  const [userList, setUserList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [editIndex, setEditIndex] = useState(-2);
  
  const { segment } = useSpeechContext();
  const [data, setData] = useState({
    username: '',
    fullname: '',
    contactphone: '',
    email: '',
    password: ''
  });
  
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

  const handleChange = (e, key) => { setData({ ...data, [key]: e }) };
  
  useEffect( () => {
    const token = storage.get('token');
    if ( token === '' ) {
      navigate('/');
    }
    setToken(token);
    setStatusMessage('Please wait a moment till finish fetching the data from server.');
    axios.get(config.api + 'user', {
      headers: {'Authorization': token}
    })
    .then( res => {
      setStatusMessage('Complete fetching the data from server.');
      setUserList(res.data);
    })
    .catch( err => {
      setStatusMessage('Error has occured while fetching the data.');
      navigate('/');
    });
  }, [])

  const editRow = (index) => {
    setEditIndex(index);
    setData({
      username: userList[index].username,
      fullname: userList[index].fullname,
      contactphone: userList[index].contactphone,
      email: userList[index].email,
      password: userList[index].password
    })
  }
  const cancelEditing = () => {
    setEditIndex(-2);
  }
  const saveRow = () => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'user/update', {
      id: userList[editIndex].id,
      updates: {
        ...data
      }
    }, {
      headers: {'Authorization': token}
    })
    .then( res => {
      setStatusMessage('Complete saving user.');
      userList[editIndex].username = data.username;
      userList[editIndex].fullname = data.fullname;
      userList[editIndex].contactphone = data.contactphone;
      userList[editIndex].email = data.email;
      userList[editIndex].password = data.password;
      setEditIndex(-2);
    })
    .catch((err)=>{
      setStatusMessage('Error has occured while Saving the data.');
      navigate('/');
    });
  }

  const deleteRow = (index) => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'user/delete', {
      id : userList[index].id
    }, {
      headers: {'Authorization': token}
    })
    .then( res => {
      setStatusMessage('Complete deleting user.');
      setUserList([...userList.slice(0, index), ...userList.slice(index+1)]);
    })
    .catch((err)=>{
      setStatusMessage('Error has occured while Deleting the data.');
      navigate('/');
    });
  }

  const addRow = () => {
    setEditIndex(-1);
    setData({
      username: '',
      fullname: '',
      contactphone: '',
      email: '',
      password: ''
    })
  }

  const requestAddRow = () => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'user/insert', {
      ...data
    }, {
      headers: {'Authorization': token}
    })
    .then( res => {
      setStatusMessage('Complete saving user.');
      setUserList([...userList, {
        id: res.data.insertId,
        ...data
      }]);
      setEditIndex(-2);
    })
    .catch((err)=>{
      console.log(err);
      setStatusMessage('Error has occured while fetching the data.');
      navigate('/');
    });
  }

  return (
    <MainLayout>
      <div>
        <p>{statusMessage}</p>
        <div className='table-menu'>
          <div className='table-left-menu'>
            <Button className='primary-button' onClick={addRow}>Add New</Button>
          </div>
        </div>
      <div style={{clear:'both'}}></div>
      </div>
      <Modal
          title={editIndex===-1?'Add new User':'Edit User'}
          show={editIndex!==-2}
          close={cancelEditing}
          okAction={editIndex===-1?requestAddRow:saveRow}
          cancelAction={cancelEditing}
          okName='Save'
          cancelName='Cancel'>
          <BigTranscript placement="top" />
          <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
          <IntroPopup />
          <VoiceInput label='User Name' value={data.username} onChange={(e)=>{handleChange(e, 'username')}}/>
          <VoiceInput label='Full Name' value={data.fullname} onChange={(e)=>{handleChange(e, 'fullname')}}/>
          <VoiceInput label='Contact Phone' value={data.contactphone} onChange={(e)=>{handleChange(e, 'contactphone')}}/>
          <VoiceInput label='Email' value={data.email} onChange={(e)=>{handleChange(e, 'email')}}/>
          <VoiceInput label='Password' value={data.password} onChange={(e)=>{handleChange(e, 'password')}}/>
        </Modal>
      <TableLayout>
        <TableHeader>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Contact Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {
            userList.length ?
            userList.map( (item, index) => {
              return <TableRow className={index%2===0?'row-odd':'row-even'} key={index}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.fullname}</TableCell>
                <TableCell>{item.contactphone}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.password}</TableCell>
                <TableCell><a onClick={()=>{editRow(index)}}>Edit</a></TableCell>
                <TableCell><a onClick={()=>{deleteRow(index)}}>Delete</a></TableCell>
              </TableRow>
            }) :
            null
          }
        </tbody>
      </TableLayout>
    </MainLayout>
  );
}

export default UserAdmin;
