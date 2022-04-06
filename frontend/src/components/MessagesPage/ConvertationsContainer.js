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
  const [search, setSearch] = useState("");
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
  }, [
    error,
    isCallApi,
    showAlert,
    getConvertations,
    resetGetConvertations,
    convertations,
  ]);

  return (
    <div className={show ? "d-block" : "d-none"}>
      <div className="mb-2">
        <Form.Control
          size="sm"
          placeholder="search convertation ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {search !== ""
              ? convertations
                  .filter((c) =>
                    String(c.user.name)
                      .toLocaleLowerCase()
                      .startsWith(search.toLocaleLowerCase())
                  )
                  .map((convertation) => (
                    <ConvertationItem
                      convertation={convertation}
                      key={convertation.user._id}
                    />
                  ))
              : convertations.map((convertation) => (
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
