import { useContext } from 'react';
import { UserData } from "./context/AuthContext";

const App = () => {
  const { isLogin, setIsLogin } = useContext(UserData);
  if(isLogin){
    return(
      <>
        Hey you are loged in
      </>
    )
  }else{

  return (
    <>
      You are Not Logged In
    </>
  )}
}

export default App