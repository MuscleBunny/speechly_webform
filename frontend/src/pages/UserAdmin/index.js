import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css';
import config from '../../config'
import {TableLayout, TableRow, TableHeader, TableCell} from '../../components/table'

function UserAdmin() {
  const [userList, setUserList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [contactphone, setContactphone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect( () => {
    axios.get(config.api + 'user')
    .then( res => {
      setUserList(res.data);
    });
  }, [])

  const editRow = (index) => {
    setEditIndex(index);
    setUsername(userList[index].username);
    setFullname(userList[index].fullname);
    setContactphone(userList[index].contactphone);
    setEmail(userList[index].email);
    setPassword(userList[index].password);
  }
  const cancelEditing = () => {
    setEditIndex(-1);
  }
  const saveRow = () => {
    axios.post(config.api + 'user/update', {
      id: userList[editIndex].id,
      updates: {
        username, fullname, contactphone, email, password
      }
    })
    .then( res => {
      userList[editIndex].username = username;
      userList[editIndex].fullname = fullname;
      userList[editIndex].contactphone = contactphone;
      userList[editIndex].email = email;
      userList[editIndex].password = password;
      setEditIndex(-1);
    });
  }

  const deleteRow = (id) => {

  }

  return (
    <div>
      <a onClick={()=>{addRow()}}>Add New</a>
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
              if ( index === editIndex ) {
                return <TableRow key={index}>
                  <TableCell><input value={username} onChange={(e)=>{setUsername(e.target.value)}}/></TableCell>
                  <TableCell><input value={fullname} onChange={(e)=>{setFullname(e.target.value)}}/></TableCell>
                  <TableCell><input value={contactphone} onChange={(e)=>{setContactphone(e.target.value)}}/></TableCell>
                  <TableCell><input value={email} onChange={(e)=>{setEmail(e.target.value)}}/></TableCell>
                  <TableCell><input value={password} onChange={(e)=>{setPassword(e.target.value)}}/></TableCell>
                  <TableCell><a onClick={()=>{saveRow(index)}}>Save</a></TableCell>
                  <TableCell><a onClick={()=>{cancelEditing()}}>Cancel</a></TableCell>
                </TableRow>
              }
              return <TableRow key={index}>
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
    </div>
  );
}

export default UserAdmin;
