import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  console.log(authUser);

  return <div>Navbar</div>;
};
export default Navbar;
