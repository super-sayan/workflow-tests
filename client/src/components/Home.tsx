const logo = require('../assets/images/Cat_Intro.png');

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img alt='logo' style={{ width: 600 }} src={String(logo)} />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-dark">Home</h1>
            <p>
              Discover Happy Cat Café, Rishon LeZions' premier destination for cat lovers! 
              As the city's first and only cat café, we offer a unique experience where you 
              can enjoy our specialty lattes while mingling with adorable, adoptable cats from a 
              local rescue. Our cozy café is the perfect spot to find your new furry friend or 
              simply relax in the company of cats. Join us for engaging events, 
              including cat yoga and painting classes, and browse our selection of cat-inspired gifts and merchandise. 
              Whether you're looking to adopt or just seeking a peaceful retreat, 
              Happy Cat Café promises a purr-fectly delightful visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;