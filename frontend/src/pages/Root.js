import { Outlet, useNavigation } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

function Root() {
  const navigation = useNavigation();

  return (
    <div>
      <MainNavigation />
      {/* {navigation.state === "loading" && <p>Loading...</p>} */}
      <Outlet />
    </div>
  );
}

export default Root;
