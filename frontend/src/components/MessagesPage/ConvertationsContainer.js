import React, { useState, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import ConvertationItem from "./ConvertationItem";
import { connect } from "react-redux";
import {
  getConvertations,
  resetGetConvertations,
} from "../../redux/message/messageActions";
import useAlert from "../../hooks/useAlert";
import Loader from "../Loader";

const ConvertationsContainer = ({
  messageGetConvertations,
  getConvertations,
  resetGetConvertations,
}) => {
  // hooks :
  const showAlert = useAlert();
  // states:
  const [isCallApi, setIsCallApi] = useState(false);
  // redux states :
  const { loading, error, convertations } = messageGetConvertations;

  useEffect(() => {
    if (!isCallApi) {
      setIsCallApi(true);
      getConvertations();
    }

    if (error) {
      showAlert({
        type: "danger",
        title: "error",
        content: error,
      });
      resetGetConvertations();
    }
  }, [error, isCallApi, showAlert, getConvertations, resetGetConvertations]);

  return (
    <>
      <div className="mb-2">
        <Form>
          <Form.Control size="sm" placeholder="search convertation ..." />
        </Form>
      </div>
      {loading ? (
        <Loader />
      ) : (
        convertations.length > 0 && (
          <ListGroup>
            {convertations.map((convertation) => (
              <ConvertationItem
                convertation={convertation}
                key={convertation.user._id}
              />
            ))}
          </ListGroup>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    messageGetConvertations: state.messageGetConvertations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getConvertations: () => dispatch(getConvertations()),
    resetGetConvertations: () => dispatch(resetGetConvertations()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConvertationsContainer);
