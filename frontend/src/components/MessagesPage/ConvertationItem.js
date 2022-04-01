import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import Avatar from "../Avatar";
import { openConvertation } from "../../redux/convertation/convertationActions";
import { connect } from "react-redux";

const ConvertationItem = ({ convertation, openConvertation }) => {
  // redux states :

  const cutMessage = (message_text) => {
    if (String(message_text).length >= 45) {
      return String(message_text).slice(0, 45) + "...";
    } else {
      return String(message_text);
    }
  };

  const lastMessageDate = (message_date) => {
    const sysDate = new Date();
    const msgDate = new Date(message_date);
    let date = "";
    if (
      sysDate.getDate() === msgDate.getDate() &&
      sysDate.getMonth() === msgDate.getMonth() &&
      sysDate.getFullYear() === msgDate.getFullYear()
    ) {
      date = msgDate.getHours() + ":" + msgDate.getMinutes();
    } else {
      date =
        msgDate.getDate() +
        "-" +
        msgDate.getMonth() +
        "-" +
        msgDate.getFullYear();
    }

    return date;
  };

  const openConvHandler = () => {
    openConvertation(convertation.user);
  };

  return (
    <ListGroup.Item className="convertation-item" onClick={openConvHandler}>
      <div className="">
        <Avatar image={convertation.user.avatar} />
        <div className="d-flex flex-column convertation-item-inf">
          <strong>{convertation.user.name}</strong>
          <p
            className={
              !convertation.message.isConnectedUserSeend &&
              !convertation.message.isSeen
                ? "not-seen-message"
                : ""
            }>
            {convertation.message.isConnectedUserSeend && (
              <span className="me">Me :</span>
            )}

            {cutMessage(convertation.message.message_text)}
          </p>
        </div>
        <div className="d-flex flex-column">
          {convertation.message.nbr > 0 && (
            <Badge>{convertation.message.nbr}</Badge>
          )}
          <small>{lastMessageDate(convertation.message.message_date)}</small>
        </div>
      </div>
    </ListGroup.Item>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openConvertation: (data) => dispatch(openConvertation(data)),
  };
};

export default connect(null, mapDispatchToProps)(ConvertationItem);
