const logo = require('../assets/images/Cat_Phone.png');

function Contact() {
  return (
    <div className="contact">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img alt='logo' style={{ width: 600 }} src={String(logo)} />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-dark">Contact</h1>
            <p>
            Reach out to us and let us know if there is anything we can do for you. 
            Please give 24 hours for a response. For urgent questions, please call 0522322047 during business hours.
            Location & Business Hours
            Happy Cat Cafe
            Cinema City, 3
            Rishon LeZion, Israel 7575126
            (052)232-20-47
            meow@happycatrl.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;