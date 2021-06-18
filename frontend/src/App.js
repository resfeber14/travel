import { useEffect, useRef, useState } from 'react';
import ReactMapGL,{Marker,Popup}  from 'react-map-gl';
import {Room,Star} from '@material-ui/icons';
import axios from 'axios'
import {format} from "timeago.js"

import "./app.css"
import Register from './components/Register';
import Login from './components/Login';


function App() {
  const myStorage=window.localStorage;
  const [currUser,setCurrUser]=useState(myStorage.getItem("user"));
  const [pins,setPins]=useState([])
  const [newPlace,setnewPlace] = useState(null)
  const title=useRef();
  const rating=useRef();
  const desc=useRef()
  const [currentPlaceId,setCurrentPlaceId]=useState(null)
  const [showRegister,setShowRegister]=useState(false);
  const [showlogin,setShowLogin]=useState(false)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4

  });
  useEffect(()=>{
    const getPins= async ()=>{
      try{
        const res=await axios.get("/pins") // we are not writing here http:localhost etc coz we have made a proxy
        setPins(res.data)
      }
      catch(err){
        console.log(err);
      }
    };
    getPins()
  },[])

  const handleMarker=(id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long});
  }
  const handleAdd=(e)=>{
    const [long,lat]=e.lngLat;
    setnewPlace({
      lat:lat,
      long:long
    })
    //console.log(e.lngLat[0],e.lngLat[1]);
  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    const newPin={
      username:currUser,
      title:title.current.value,
      desc:desc.current.value,
      rating:rating.current.value,
      lat:newPlace.lat,
      long:newPlace.long 
    }      
    //console.log(newPin)
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setnewPlace(null);
    } catch (err) {
      console.log(err);

    }
  }
  const handleLogout=()=>{
    myStorage.removeItem("user");
    setCurrUser(null);
  }
  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      transitionDuration="200"
      onDblClick={handleAdd}

      >
      {pins.map((p)=>(
      <>
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={- viewport.zoom*3.5} offsetTop={- viewport.zoom*7}>
        <Room style={{fontSize: viewport.zoom*7, color: p.username===currUser? "tomato": "slateblue" ,cursor:"pointer"}} 
        onClick={()=>handleMarker(p._id,p.lat,p.long)}/>
        
      </Marker>
      {p._id===currentPlaceId && (
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          anchor="left" 
          >
          <div className="card">
            <label>Place</label>
            <h4>{p.title}</h4>
            <label>Preview</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
            {Array(p.rating).fill(<Star className="star"/>)}  {/*takes the no as an array and fill the component in that array*/}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className="date">{format(p.createdAt)}</span>
          </div>
        </Popup>)}
        </>
      ))}
      {newPlace && 
      (<Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setnewPlace(null)}
          anchor="left" 
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" ref={title}></input>
                <label>Review</label>
                <textarea placeholder="Say us something about this place!" ref={desc}></textarea>
                <label>Rating</label>
                <select ref={rating}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitBtn" type="submit">Add Place</button>
              </form>
            </div>
          </Popup>)}
          {currUser ? <button className="btn logout" onClick={handleLogout}>Log out</button>:
          
          <div className="btns">
            <button className="btn login" onClick={()=>setShowLogin(true)}>Log in</button>
            <button className="btn register" onClick={()=>setShowRegister(true)}>Register</button>
          </div>
          }
          {showRegister && <Register setShowRegister={setShowRegister}/>}
          {showlogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrUser={setCurrUser}/>}
      </ReactMapGL>
      
    

    </div>
  );
}

export default App;
