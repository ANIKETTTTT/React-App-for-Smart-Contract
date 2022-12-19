import './App.css'
import useMetaMask from './hooks/metamask';
import NavbarComp from './components/Navbar';
import Admin from './Admin';
import User from './User'
import { useState ,useEffect} from 'react';
import Cart from './cart';
import Web3 from "web3";
import { contractAbi, contractAddress } from "./config";

function App() {
  
  const { connect, disconnect, isActive, account, shouldDisable,library } = useMetaMask()
  const [cartItem,setCartItem] = useState([]);
  const [showCart,setShowCart]= useState(false);
  const [plans, setPlans] = useState([]);
  const [subscribedPlans, setSubscribedPlans] = useState([]);
  const [prevPlans, setPrevPlans] = useState([]);
  useEffect(() => {
    fetchData();
  }, [account, library]);

  const fetchData = async () => {
    if (account) {
      const web3 = new Web3(library.provider);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      // const tx = await contract.methods.pay(subscriber, payPlanId).send({from: account, value: payAmount * (10 ** 18)})
      const count = await contract.methods.getCount().call();
      console.log(count);

      const vPlan = [];

      for (var i = 0; i < count; i++) {
        var temp = await contract.methods.getPlan(i).call();
        vPlan.push(temp);
      }
      setPlans(vPlan);

      }
      
  };
if(isActive)
{
  console.log("cartItem",cartItem)
  return (
    <div className="App">
      <NavbarComp isActive={isActive} addCartItem={setCartItem} cartItem={cartItem} setShowCart={setShowCart}/>
      {
        account=="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"?<Admin/>:<>
        {
          showCart?<Cart cartItem={cartItem} deleteCartItem={setCartItem} plans={plans} subscribedPlans={subscribedPlans} addSubcribedPlans={setSubscribedPlans} prevPlans={prevPlans} addPrevPlans={setPrevPlans} emptyPrevPlans={setPrevPlans}/>:<User addCartItem={setCartItem} cartItem={cartItem} subscribedPlans={subscribedPlans} emptySubcribedPlans={setSubscribedPlans} prevPlans={prevPlans} emptyPrevPlans={setPrevPlans} addPrevPlans={setPrevPlans} addSubcribedPlans={setSubscribedPlans}/>
        }
        </>
      }
    </div>
  );
}
else{
  return (
    <div>
       <NavbarComp isActive={isActive}/>
       <h1>Wait..</h1>
    </div>
  )
}
  
}

export default App;
