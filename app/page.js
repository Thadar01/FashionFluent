import Link from "next/link";
import { MainMenu } from "./Admin/components/MainMenu";
import Image from "next/image";

export default function Home() {
  return (
    <>
     <Link href={'/Admin'}>Admin</Link>
     <Link href={'/User'}>User</Link>
 </>
  );
}
