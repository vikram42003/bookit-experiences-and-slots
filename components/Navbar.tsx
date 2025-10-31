import Image from "next/image";
import Searchbar from "./Searchbar";

const Navbar = () => {
  return (
    <div className="border-b shadow-sm">
      <div className="layout-container flex items-center justify-between">
        <Image src={"/HDlogo.png"} alt="Highway delite" width={100} height={100} />

        <Searchbar />
      </div>
    </div>
  );
};

export default Navbar;
