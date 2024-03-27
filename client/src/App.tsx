import UserContext from "./components/AccountContext";
//import ToggleColorMode from "./components/ToggleColorMode";
import { Navigation } from "./components";
import Views from "./components/Views";

function App() {
  return (
    <UserContext>
      <Navigation />
      <Views />
      {/* <ToggleColorMode /> */}
    </UserContext>
  );
}

export default App;
