import React, { useEffect } from "react";
import Post from "../components/Post";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getPosts,
  resetCreatePost,
  resetLikePost,
  resetRemovePost,
  resetUnlikePost,
} from "../redux/post/postActions";
import useAlert from "../hooks/useAlert";
import Loader from "../components/Loader";
import AddPost from "../components/HomePage/AddPost";

const HomePage = ({
  getPosts,
  postList,
  resetRemovePost,
  resetLikePost,
  resetUnlikePost,
}) => {
  // hooks:
  const showAlert = useAlert();
  // redux states :
  const { error, loading, posts } = postList;

  useEffect(() => {
    if (!error && posts.length === 0) {
      getPosts();
    }

    if (error) {
      showAlert({
        type: "danger",
        title: "Error",
        content: error,
      });
    }
    return () => {
      resetRemovePost();
      resetCreatePost();
      resetLikePost();
      resetUnlikePost();
    };
  }, [
    error,
    getPosts,
    posts.length,
    resetRemovePost,
    resetCreatePost,
    resetLikePost,
    resetUnlikePost,
  ]);

  return (
    <Row>
      <Col sm={12} md={1} lg={3} xl={3}></Col>
      <Col sm={12} md={10} lg={6} xl={6}>
        <AddPost />
        {loading && <Loader />}
        {posts.length !== 0 &&
          posts.map((post) => <Post key={post._id} post={post} />)}
      </Col>
      <Col sm={12} md={1} lg={3} xl={3}></Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  const { postList } = state;
  return { postList };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: () => dispatch(getPosts()),
    resetRemovePost: () => dispatch(resetRemovePost()),
    resetLikePost: () => dispatch(resetLikePost()),
    resetUnlikePost: () => dispatch(resetUnlikePost()),
    resetCreatePost: () => dispatch(resetCreatePost()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
