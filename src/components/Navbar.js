import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import useMetaMask from '../hooks/metamask';
import { Button } from 'react-bootstrap'
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
function NavbarComp(props) {
    const { connect, disconnect, isActive, account, shouldDisable } = useMetaMask()
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand >
        {
          props.isActive?<h2 onClick={()=>{props.setShowCart(false)}}>Home</h2>: <></>
                
} 
          </Navbar.Brand>
          <Navbar.Brand >
            {
                props.isActive?<h2 onClick={()=>{props.setShowCart(true)}}><Badge color="secondary" badgeContent={props.cartItem.length}>
                <ShoppingCartIcon />{" "}
              </Badge></h2>:     <Button variant="secondary" onClick={connect} disabled={shouldDisable}>
               Login
              </Button>
                  
            }
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComp;