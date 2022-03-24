import { useDispatch } from "react-redux";
import { showDialog } from "../redux/dialog/dialogActions";

const useDialog = () => {
  const dispatch = useDispatch();
  return ({ title, content, onYes, onNo }) =>
    dispatch(showDialog({ title, content, onYes, onNo }));
};

export default useDialog;
