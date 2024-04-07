import React from "react";
import user1 from "../../assets/images/users/user-1.jpg";
import postImage1 from "../../assets/images/posts/post-1.jpg";

import './Post.css'

function Post() {
  return (
    <>
      <div className="posts-section mb-5">
        <div className="post border-bottom p-3 bg-white w-shadow">
          <div className="media text-muted pt-3">
            <img
              src={user1}
              alt="Online user"
              className="mr-3 post-user-image"
            />
            <div className="media-body pb-3 mb-0 small lh-125">
              <div className="d-flex justify-content-between align-items-center w-100">
                <a href="#" className="text-gray-dark post-user-name">
                  John Michael
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
                          <span className="fs-9">Snooze Lina for 30 days</span>
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
                3 hours ago <i className="bx bx-globe ml-3"></i>
              </span>
            </div>
          </div>
          <div class="mt-3 description-post">
            <p class="">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
              voluptatem veritatis harum, tenetur, quibusdam voluptatum,
              incidunt saepe minus maiores ea atque sequi illo veniam sint
              quaerat corporis totam et. Culpa?
            </p>
          </div>

          <div className="d-block mt-3">
            <img src={postImage1} className="post-content" alt="post image" />
          </div>
          <div className="mb-3">
            {/* Reactions */}
            <div className="argon-reaction">
              <span className="like-btn">
                <a href="#" className="post-card-buttons" id="reactions">
                  <i className="bx bxs-like mr-2"></i> 67
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
              href="javascript:void(0)"
              className="post-card-buttons"
              id="show-comments"
            >
              <i className="bx bx-message-rounded mr-2"></i> 5
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

          {/* //----------- */}
        </div>
      </div>
    </>
  );
}

export default Post;
