function WeatherBar() {
    return ( 
        <>
        <div className="col-md-3 third-section">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="weather-card-header d-flex justify-content-between align-items-center">
                  <p className="fs-1 mb-0">11:37 PM</p>
                  <a href="#" className="btn text-primary">California, CA <i className="bx bx-chevron-down"></i></a>
                </div>
                <div className="weather-quick align-items-center mt-4">
                  <div className="row">
                    <div className="col-md-8">
                      <img src="assets/images/icons/weather/sun.png" width="40" height="40" alt="Weather icon" />
                      <h1 className="weather-card display-4 ml-3">
                        28<span className="text-muted">&deg;</span>
                      </h1>
                    </div>
                    <div className="col-md-4">
                      <p className="mb-0 fs-1">
                        <i className="bx bx-droplet"></i> 15%
                      </p>
                      <p className="mb-0 fs-1">
                        <i className="bx bx-flag"></i> 10km/h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
     );
}

export default WeatherBar;
