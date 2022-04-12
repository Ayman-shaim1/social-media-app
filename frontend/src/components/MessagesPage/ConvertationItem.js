import React, { useEffect } from "react";
import { ListGroup, Badge, Dropdown } from "react-bootstrap";
import Avatar from "../Avatar";
import { openConvertation } from "../../redux/convertation/convertationActions";
import {
  getMessages,
  resetGetMessages,
  removeConvertation,
  resetRemoveConvertation,
} from "../../redux/message/messageActions";
import { connect } from "react-redux";
import useDialog from "../../hooks/useDialog";
import useAlert from "../../hooks/useAlert";

const ConvertationItem = ({
  convertation: convertationData,
  messageList,
  messageRemoveConvertation,

  openConvertation,
  getMessages,
  removeConvertation,

  resetGetConvertations,
  resetRemoveConvertation,
}) => {
  // hooks :
  const showDialog = useDialog();
  const showAlert = useAlert();

  // redux states:
  const { loading: messageListLoading } = messageList;
  const {
    loading: messageRemoveConvertationLoading,
    error: messageRemoveConvertationError,
    success: messageRemoveConvertationSuccess,
  } = messageRemoveConvertation;

  const cutMessageHandler = (message_text) => {
    if (String(message_text).length >= 45) {
      return String(message_text).slice(0, 45) + "...";
    } else {
      return String(message_text);
    }
  };

  const addZeroToNumber = (number) => {
    const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (numArr.findIndex((num) => num === number) !== -1) {
      return "0" + number;
    } else {
      return number;
    }
  };

  const lastMessageDateHandler = (message_date) => {
    const sysDate = new Date();
    const msgDate = new Date(message_date);
    let date = "";
    if (
      sysDate.getDate() === msgDate.getDate() &&
      sysDate.getMonth() === msgDate.getMonth() &&
      sysDate.getFullYear() === msgDate.getFullYear()
    ) {
      date =
        addZeroToNumber(msgDate.getHours()) +
        ":" +
        addZeroToNumber(msgDate.getMinutes());
    } else if (
      sysDate.getDate() - msgDate.getDate() === 1 &&
      sysDate.getMonth() === msgDate.getMonth() &&
      sysDate.getFullYear() === msgDate.getFullYear()
    ) {
      date = "yesterday";
    } else {
      date = `${addZeroToNumber(msgDate.getDate())}/${addZeroToNumber(
        Number(msgDate.getMonth() + 1)
      )}/${msgDate.getFullYear()}`;
    }

    return date;
  };

  const openConvHandler = () => {
    if (!messageListLoading) {
      resetGetMessages();
      getMessages(convertationData.user._id);
      openConvertation(convertationData.user);
    }
  };

  const removeConvHandler = (e) => {
    e.preventDefault();
    showDialog({
      title: "confirmation",
      content: "Are you sure you want to delete this convertation ?",
      onYes: () => {
        removeConvertation(convertationData.user._id);
      },
    });
  };

  useEffect(() => {
    if (messageRemoveConvertationError) {
      showAlert({
        type: "danger",
        title: "error",
        content: messageRemoveConvertationError,
      });
    }

    if (messageRemoveConvertationSuccess) {
      resetRemoveConvertation();
    }
  }, [
    resetRemoveConvertation,
    showAlert,
    messageRemoveConvertationSuccess,
    messageRemoveConvertationError,
  ]);

  return (
    <ListGroup.Item
      className={`convertation-item${
        messageListLoading || messageRemoveConvertationLoading
          ? " convertation-item-loading"
          : ""
      }`}
      onClick={openConvHandler}>
      <div>
        <Avatar
          image={convertationData.user.avatar}
          userId={convertationData.user._id}
        />
        <div className="d-flex flex-column convertation-item-inf">
          <strong>{convertationData.user.name}</strong>
          <p
            className={
              !convertationData.message.isConnectedUserSeend &&
              !convertationData.message.isSeen
                ? "not-seen-message"
                : ""
            }>
            {convertationData.message.isConnectedUserSeend && (
              <span className="me">Me :</span>
            )}

            {convertationData.message.message_text !== null
              ? cutMessageHandler(convertationData.message.message_text)
              : "sent a post"}
          </p>
        </div>
        <div className="d-flex flex-column convertation-item-inf-lss">
          {convertationData.message.nbr > 0 && (
            <Badge>{convertationData.message.nbr}</Badge>
          )}
          <small>
            {lastMessageDateHandler(convertationData.message.message_date)}
          </small>
        </div>
        <Dropdown onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle size="sm"></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#" onClick={removeConvHandler}>
              <i className="fas fa-trash text-danger"></i>
              delete convertation
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </ListGroup.Item>
  );
};

const mapStateToProps = (state) => {
  return {
    messageList: state.messageList,
    messageRemoveConvertation: state.messageRemoveConvertation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: (id) => dispatch(getMessages(id)),
    openConvertation: (data) => dispatch(openConvertation(data)),
    removeConvertation: (id) => dispatch(removeConvertation(id)),
    resetGetMessages: () => dispatch(resetGetMessages()),
    resetRemoveConvertation: () => dispatch(resetRemoveConvertation()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConvertationItem);
