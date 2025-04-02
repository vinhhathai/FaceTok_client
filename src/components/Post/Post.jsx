import React from "react";
import './Post.css'

function Post({ post, defaultUserImage, defaultPostImage }) {
  // Sử dụng dữ liệu từ props hoặc dữ liệu mặc định
  const userImage = post?.userImage || defaultUserImage;
  const postImage = post?.image || defaultPostImage;
  const userName = post?.userName || "User Name";
  const postTime = post?.time || "3 hours ago";
  const postContent = post?.content || "No content available";
  const likeCount = post?.likeCount || 0;
  const commentCount = post?.commentCount || 0;

  return (
    <>
      <div className="posts-section mb-5">
        <div className="post border-bottom p-3 bg-white w-shadow">
          <div className="media text-muted pt-3">
            <img
              src={userImage}
              alt="User"
              className="mr-3 post-user-image"
            />
            <div className="media-body pb-3 mb-0 small lh-125">
              <div className="d-flex justify-content-between align-items-center w-100">
                <a href="#" className="text-gray-dark post-user-name">
                  {userName}
                </a>
                <div className="dropdown">
                  <a
                    href="#"
                    className="post-more-settings"
                    role="button"
                    data-toggle="dropdown"
                    id="postOptions"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right dropdown-menu-lg-left post-dropdown-menu">
                    <a
                      href="#"
                      className="dropdown-item"
                      aria-describedby="savePost"
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <i className="bx bx-bookmark-plus post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                          <span className="fs-9">Save post</span>
                          <small id="savePost" className="form-text text-muted">
                            Add this to your saved items
                          </small>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      aria-describedby="hidePost"
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <i className="bx bx-hide post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                          <span className="fs-9">Hide post</span>
                          <small id="hidePost" className="form-text text-muted">
                            See fewer posts like this
                          </small>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      aria-describedby="snoozePost"
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <i className="bx bx-time post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                          <span className="fs-9">Snooze {userName} for 30 days</span>
                          <small
                            id="snoozePost"
                            className="form-text text-muted"
                          >
                            Temporarily stop seeing posts
                          </small>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      aria-describedby="reportPost"
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <i className="bx bx-block post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                          <span className="fs-9">Report</span>
                          <small
                            id="reportPost"
                            className="form-text text-muted"
                          >
                            I'm concerned about this post
                          </small>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <span className="d-block text-left">
                {postTime} <i className="bx bx-globe ml-3"></i>
              </span>
            </div>
          </div>
          <div className="mt-3 description-post">
            <p className="">
              {postContent}
            </p>
          </div>

          {postImage && (
            <div className="d-block mt-3">
              <img src={postImage} className="post-content" alt="post image" />
            </div>
          )}
          
          <div className="mb-3">
            {/* Reactions */}
            <div className="argon-reaction">
              <span className="like-btn">
                <a href="#" className="post-card-buttons" id="reactions">
                  <i className="bx bxs-like mr-2"></i> {likeCount}
                </a>
                <ul className="reactions-box dropdown-shadow">
                  <li
                    className="reaction reaction-like"
                    data-reaction="Like"
                  ></li>
                  <li
                    className="reaction reaction-love"
                    data-reaction="Love"
                  ></li>
                  <li
                    className="reaction reaction-haha"
                    data-reaction="HaHa"
                  ></li>
                  <li
                    className="reaction reaction-wow"
                    data-reaction="Wow"
                  ></li>
                  <li
                    className="reaction reaction-sad"
                    data-reaction="Sad"
                  ></li>
                  <li
                    className="reaction reaction-angry"
                    data-reaction="Angry"
                  ></li>
                </ul>
              </span>
            </div>
            <a
              href="#"
              className="post-card-buttons"
              id="show-comments"
            >
              <i className="bx bx-message-rounded mr-2"></i> {commentCount}
            </a>
            <div className="dropdown dropup share-dropup">
              <a
                href="#"
                className="post-card-buttons"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-share-alt mr-2"></i> Share
              </a>
              <div className="dropdown-menu post-dropdown-menu">
                <a href="#" className="dropdown-item">
                  <div className="row">
                    <div className="col-md-2">
                      <i className="bx bx-share-alt"></i>
                    </div>
                    <div className="col-md-10">
                      <span>Share Now (Public)</span>
                    </div>
                  </div>
                </a>
                <a href="#" className="dropdown-item">
                  <div className="row">
                    <div className="col-md-2">
                      <i className="bx bx-share-alt"></i>
                    </div>
                    <div className="col-md-10">
                      <span>Share...</span>
                    </div>
                  </div>
                </a>
                <a href="#" className="dropdown-item">
                  <div className="row">
                    <div className="col-md-2">
                      <i className="bx bx-message"></i>
                    </div>
                    <div className="col-md-10">
                      <span>Send as Message</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Default props
Post.defaultProps = {
  defaultUserImage: require("../../assets/images/users/user-1.jpg"),
  defaultPostImage: null,
};

export default Post;
