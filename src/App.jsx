
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const InputHandler = (props) => {
  return (
    <div className="row my-3">
      <div className="col">
        <div className="form-group files">
          <label>{props.label}</label>
          <input type="file" className="form-control" multiple onChange={props.onChange} />
        </div>
      </div>
    </div>
  );
}

//use -- npm run start

function App() {

  const [files, setFiles] = useState(null);
  const [secondFiles, setSecondFiles] = useState(null);
  const [loaded, setLoaded] = useState(0);


  const handleFileChange = (event) => {
    setLoaded(0)
    //console.log(event.target.files);
    if (maxSelectFile(event, 1) && allowedFiletypes(event) && maxFileSize(event)) {
      setFiles(event.target.files);
      //ok
    }
  };

  const handleSecondFileChange = (event) => {
    setLoaded(0)
    console.log(event.target.files, event.target.value);
    if (maxSelectFile(event) && allowedFiletypes(event) && maxFileSize(event)) {
      setSecondFiles(event.target.files);
    }

  };


  const maxSelectFile = (event, limiter = 3) => {
    const files = event.target.files;

    if (files.length > limiter) {
      const msg = 'Only ' + limiter + ' images can be uploaded at a time';
      toast.error(msg, { autoClose: 1000, });
      event.target.value = null;

      // console.log(msg)

      return false;
    }
    return true;
  }



  const allowedFiletypes = (event) => {
    const typesAllowed = ["image/png", "application/json"];
    const files = event.target.files;
    let booleann = true;
    for (let x = 0; x < files.length; x++) {
      booleann = typesAllowed.includes(files[x].type) ? true : false;
      if (booleann === false) {
        const msg = 'allowed File types  ["image/png", "application/json"]';
        toast.error(msg, { autoClose: 1000, });
        event.target.value = null;
        return booleann;
      };

    };
    return booleann;
  };


  const maxFileSize = (event) => {
    const size = 3000;
    const files = event.target.files;
    for (let x = 0; x < files.length; x++) {
      console.log(files[x].size)
      if (files[x].size > size) {

        const msg = 'file is too large, please pick a smaller file';
        event.target.value = null;
        toast.error(msg, { autoClose: 1000, });
        return false;
      }

      return true;
    };
  };

  const onClickHandler = () => {

    if (secondFiles === null || files === null) {
      toast.error('Please slect some files', { autoClose: 1000, })
      return;
    }


    const data = new FormData();

    for (let x = 0; x < files?.length || 0; x++) {
      data.append('Uploadfiles', files[x]);
    };

    for (let x = 0; x < secondFiles?.length || 0; x++) {
      data.append('gallery', secondFiles[x]);
    };
    //console.log('onClickHandler', data);



    // axios.post('http://localhost:8000/uploadd', data, {
    //   onUploadProgress: ProgressEvent => {
    //     setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
    //   }
    // })
    //   .then(res => console.log(res.statusText))
    //   .catch(err => console.log(err))


    //OR

    axios.post('http://localhost:8000/uploadd', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: ProgressEvent => {
        setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
      }
    },

    ).then(res => { console.log(res.statusText); toast.success('upload success', { autoClose: 1000, }) })
      .catch(err => { console.log(err); toast.error('upload fail', { autoClose: 1000, }); })

  };

  //console.log('files', loaded);

  return (
    <div className="container">

      {/* <form method="post" action="#" id="#"> */}
      <InputHandler
        key="handleFileChange"  //key if state existed in InputHandler , key different would cause reset of state, helps react differentiate like .map usage
        label={`Upload Your  1 File`}
        onChange={handleFileChange}
      />
      <InputHandler
        key="handleSecondFileChange"
        label={`Upload Your max 2 gallery Files `}
        onChange={handleSecondFileChange}
      />
      <button type="button" className="btn btn-success btn-block my-2" onClick={onClickHandler}>Upload</button>

      {/* </form> */}

      <ToastContainer />
      <div className="row">
        <div className="col">
          <ProgressBar now={loaded} />
        </div>
      </div>

    </div>
  );
}

export default App;
