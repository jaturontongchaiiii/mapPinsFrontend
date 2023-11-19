import { useState, useEffect } from 'react'
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import './App.css'
import axios from 'axios';
import Login from "./components/Login/Login";
import Register from './components/Register/Register';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';

function App() {

const [showLogin, setShowLogin] = useState(false);
const [showRegister, setShowRegister] = useState(false);

  const REACT_APP_MAPBOX = "YOUR_TOKEN";
  const [pins, setPins]: any = useState([]);
  const [currentPlaceId, setCurrentPlaceId]: any = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 13,
    longitude: 101,
    zoom: 8,
  });

  const [newPlace, setNewPlace]: any = useState(null);
  const [title, setTitle]: any = useState(null);
  const [desc, setDesc]: any = useState(null);
  const [rating, setRating]: any = useState(null);

  const getPins = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/pins/all");
      setPins(res.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPins();
  }, [])

  const handleMarkerClick = (id: any, lat: any, long: any) => {
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude: +lat, longitude: +long});
  }

  const handleAddClick = (e: any) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:3001/api/pins/", {
        title,
        desc,
        rating,
        lat: newPlace.lat,
        long: newPlace.long,
      }, {
        headers: {
          'x-access-token': token,
        }
      })
      getPins();
      setNewPlace(null);

    } catch(err) {
      console.log(err);
    }
  }

  const handleLogout = (e: any) => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
  }

  return (
    <div className='App'>
      <ReactMapGL 
        {...viewport}
        mapboxApiAccessToken={REACT_APP_MAPBOX}
        onViewportChange={(viewport: any) => setViewport(viewport)}
        onDblClick={handleAddClick}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >

        {pins.map((p: any) => (
          <>
            <Marker
              key={p._id}
              latitude={+p.lat}
              longitude={+p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              
              <PlaceIcon
                style={{
                  width: viewport.zoom * 7,
                  color: p.createdBy === localStorage.getItem("email") ? "tomato" : "slateblue"
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              >
              </PlaceIcon>
              
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id + "_popup"}
                latitude={+p.lat}
                longitude={+p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <h4 className='desc'>{p.desc}</h4>
                  <label>Rating</label>
                  <div className='stars'>
                    { + p.rating > 0 && (<StarIcon className='star'></StarIcon>)}
                    { + p.rating > 1 && (<StarIcon className='star'></StarIcon>)}
                    { + p.rating > 2 && (<StarIcon className='star'></StarIcon>)}
                    { + p.rating > 3 && (<StarIcon className='star'></StarIcon>)}
                    { + p.rating > 4 && (<StarIcon className='star'></StarIcon>)}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created By <b>{p.createdBy}</b></span>
                  <span className='date'>{p.createdAt}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor='left'
            onClose={() => setNewPlace(null)}
          >
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)}></input>
                  <label>Review</label>
                  <input placeholder='Say us someting about this place.' onChange={(e) => setDesc(e.target.value)}></input>
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className='submitButton' type="submit">
                    Add Pin
                  </button>
                </form>
            </div>
          </Popup>
        )}

        {localStorage.getItem("email") ? (

          <button className='button logout' onClick={handleLogout}>
            Log out
          </button>

        ) : (
          <div className='buttons'>
            <button className='button login' onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className='button register' onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>

        )}

        {showRegister && <Register setShowRegister={setShowRegister}></Register>}
        {showLogin &&  <Login setShowLogin={setShowLogin}></Login>}

      </ReactMapGL>
    </div> 
  )
}

export default App
