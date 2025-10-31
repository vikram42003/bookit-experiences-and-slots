import Image from "next/image";
import Searchbar from "./Searchbar";
import Link from "next/link";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <div className="border-b shadow-sm">
      <div className="layout-container flex items-center justify-between">
        <Link href="/">
          <Image src={"/HDlogo.png"} alt="Highway delite" width={100} height={55} />
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <Searchbar />
        </Suspense>
      </div>
    </div>
  );
};

export default Navbar;
