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
  show,
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
    <div className={show ? "d-block" : "d-none"}>
      <div className="mb-2">
        <Form>
          <Form.Control size="sm" placeholder="search convertation ..." />
        </Form>
      </div>
      {loading ? (
        <div className="mt-5 pt-2">
          <div className="mt-5 pt-3">
            <div className="mt-5">
              <Loader size="md" />
            </div>
          </div>
        </div>
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
    </div>
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
