import { Outlet } from "react-router-dom";

function Appointments() {
  return (
    <div className="home">
      <div className="container">
        <h1 className="text-center mt-5">Appointments page</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default Appointments;