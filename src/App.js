import imag from './logo.svg';
import './App.css';
// import React, {useState} from 'react';
// import ReactS3 from 'react-s3'
import { useEffect, useRef,useState } from 'react';
import { Storage, Amplify } from 'aws-amplify';
// import S3 from 'react-aws-s3'

// const config={
//   accessKeyId:'AKIARP76KWTXZEGRKVXD',
//   secretAccessKey:'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',
//   region:'ap-south-1',
//   bucketName:'miniproj1',
// }
// function App() {
//   var nme = "Madhavan"
//   const [file, setFile] = useState()
//   const handleFileInput = (e) => {
//     setFile(e.target.files[0]);
//   }

//   const uploadfile=async(file)=> {
//     const ReactS3Client = new S3(config);
//     ReactS3Client.uploadFile(file,file.name).then(data=>{
//       console.log(data.location)
//     })
//   }
  // function handleSubmit(event) {
  //   event.preventDefault()
  //   const url = 'http://localhost:3000/uploadFile';
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('fileName', file.name);
  //   const config = {
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //     },
  //   };
  //   axios.post(url, formData, config).then((response) => {
  //     console.log(response.data);
  //   });
// }



function App() {
  const ref = useRef(null);
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState();

  useEffect(() => {
    Amplify.configure({
      Auth: {
        identityPoolId: "us-east-1:167c882a-91ad-429f-a205-717d4f27991f",
        region: "us-east-1",
      },

      Storage: {
        AWSS3: {
          bucket: "miniproj12",
          region: "us-east-1",
        },
      },
    });
  }, []);

  const loadImages = () => {
    Storage.list("")
      .then((files) => {
        console.log(files);
        setFiles(files);
      })
      .catch((err) => {
        console.log(err);
      });    
  }

  useEffect(() => {
    loadImages();
   }, []);

  const handleFileLoad = () => {
    const filename = ref.current.files[0].name;
    Storage.put(filename, ref.current.files[0], {
      progressCallback: (progress) => {
        setProgress(Math.round((progress.loaded / progress.total) * 100) + "%");
        setTimeout(() => { setProgress() }, 1000);
      }
    })
      .then(resp => {
      console.log(resp);
      loadImages();
    }).catch(err => {console.log(err);});
  }

  const handleShow = (file) => {
    Storage.get(file).then(resp => {
      console.log(resp);
      setImage(resp)
    }).catch(err => { console.log(err); });
  }

  const handleDelete = (file) => {
    Storage.remove(file).then(resp => {
      console.log(resp);
      loadImages();
     }).catch(err => { console.log(err); });
  }


  return (
    <div className="App">
      <h1>Welcome Nishant</h1>
      <div className='box'>
        <div className="card one">
          <img src={imag} alt="" />
          <div className="container">
            <h4><b>Upload</b></h4>
            <form id="fileform" >
              <input ref={ref} type="file" onChange={handleFileLoad}/>

              
              <div className='btn'>
                {/* <input type="submit" id='subbtn' onClick={()=>handleFileLoad}/> */}
              </div>
            </form>
          </div>
        </div>
        <div className="vertical"></div>
        <div className='boxr'>
          <div className="card two">
            <img src={imag} alt="" />
            <div className="container">
              <h4><b>Retrieve</b></h4>
              <form id=''>
                <p>Link</p>
                <input type="text" id="txt" />
                <div className='btn'>
                  <input type="submit" id='subbtn' />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;


