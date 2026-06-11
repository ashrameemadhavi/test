const Footer = () => (
  <footer className="bg-secondary-custom text-white py-4 mt-auto">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h5 className="mb-1">
            <span className="text-accent">Smart</span> IT Solutions
          </h5>
          <p className="text-white-50 small mb-0">
            Professional software development cost estimation
          </p>
        </div>
        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <p className="text-white-50 small mb-0">
            &copy; {new Date().getFullYear()} Smart IT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
