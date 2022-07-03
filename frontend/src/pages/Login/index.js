import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import './index.css';
import config from '../../config'
import storage from '../../libs/storage';
import Button from '../../components/Button'

import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup,
} from "@speechly/react-ui";
import { VoiceInput, VoiceCheckbox } from "@speechly/react-voice-forms";

function Login() {
  const { segment } = useSpeechContext();
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  
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
    const token = storage.get('token');
    if ( token ) {
      // navigate('/vehicle');
    }
  }, []);

  const loginSubmit = () => {
    setStatusMessage('Please wait.');
    axios.post(config.api + 'login', {
      username: data.username,
      password: data.password
    })
    .then( res => {
      if ( res.data.success === false ) {
        storage.set('token', '');
        setStatusMessage('Wrong password or user name.');
        return;
      }
      setStatusMessage('Success.');
      storage.set('token', res.data.token);
      navigate('/vehicle');
    })
    .catch((err)=>{
      storage.set('token', '');
      setStatusMessage('Wrong password or user name.');
    });
  }

  return (
    <div>
      <p>{statusMessage}</p>
      {/* <div>
        <span style={{width:'100px', display:'inline-block'}}>UserName : </span><input value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
      </div>
      <div>
        <span style={{width:'100px', display:'inline-block'}}>Password : </span><input type={password} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </div>
      <a onClick={loginSubmit}>Login</a> */}
      <BigTranscript placement="top" />
      <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
      <IntroPopup />
      <div className="Form">
        <div className="Form_group">
          <VoiceInput
            label='Username'
            value={data.username}
            onChange={(e) => handleChange(e, "username")}
          />
        </div>
        <div className="Form_group">
          <VoiceInput
            label='Password'
            type='password'
            value={data.password}
            onChange={(e) => handleChange(e, "password")}
          />
        </div>
        <Button onClick={loginSubmit}>Login</Button>
      </div>
    </div>
  );
}

export default Login;
