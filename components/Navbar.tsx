import Image from "next/image";
import Searchbar from "./Searchbar";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="border-b shadow-sm">
      <div className="layout-container flex items-center justify-between">
        <Link href="/">
          <Image src={"/HDlogo.png"} alt="Highway delite" width={100} height={55} />
        </Link>

        <Searchbar />
      </div>
    </div>
  );
};

export default Navbar;
