import { io } from "socket.io-client";

const SERVER = "https://socialmedia01.herokuapp.com/";
// const SERVER = "http://localhost:5000";
const socket = io(SERVER);

export default socket;
