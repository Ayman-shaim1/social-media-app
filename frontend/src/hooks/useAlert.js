import { useDispatch } from "react-redux";
import { showAlert } from "../redux/alert/alertActions";

const useAlert = () => {
  const dispatch = useDispatch();
  return ({ type, title, content }) =>
    dispatch(showAlert({ type, title, content }));
};

export default useAlert;
