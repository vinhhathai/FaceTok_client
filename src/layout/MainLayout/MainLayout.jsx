import Header from "../../components/Header/Header";

function MainLayout({ leftSidebar, content, rightSidebar }) {
  return (
    <>
      <div className="row newsfeed-right-side-content mt-3 custome-bg">
        {leftSidebar}
        <div class="col-md-6 second-section" id="page-content-wrapper">
          {content}
        </div>

        {rightSidebar}
      </div>
    </>
  );
}

export default MainLayout;
