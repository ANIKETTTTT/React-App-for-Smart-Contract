import React, { useEffect, useState } from "react";
import "./App.css";
import useMetaMask from './hooks/metamask';

import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
import Button from "react-bootstrap/Button";
import { contractAbi, contractAddress } from "./config";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from 'react-bootstrap/Image'
import emptyCart  from './emptyCart.png'


function Cart(props) {
  const { connect, disconnect, isActive, account, shouldDisable,library } = useMetaMask()
    const [plans, setPlans] = useState(props.plans);
    const handleDelete=(element)=> {
      const index = props.cartItem.indexOf(element);
     
if (index > -1) { // only splice array when item is found
  
  props.deleteCartItem([
    ...props.cartItem.slice(0, index),
    ...props.cartItem.slice(index + 1)
  ]);
}
    }
    const handleSubscribe =  () => {
      const web3 = new Web3(library.provider);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      props.cartItem.forEach( element =>{
        let plan = plans[element];
   contract.methods
          .subscribe(element)
          .send({ from: account, value: (plan.amount / 10 ** 18)* 10 ** 18 });
         
            props.addSubcribedPlans(props.cartItem)
            setTimeout(() => {
              props.deleteCartItem([])   
            }, 5000);          

      });  
    };
      const getPurchasedPlans=()=>{
        if (props.cartItem.length!=0){
          return props.cartItem.map(function (index){
            let plan = plans[index]
            return (
                    <Col>
                      <Card>
                        <Card.Header as="h5">Plan {index}</Card.Header>
                        <Card.Body>
                          <Card.Title>
                            Amount : {plan.amount / 10 ** 18}{" "}
                          </Card.Title>
                          <Card.Text>
                            <b>Plan duration</b> : {plan.frequency}
                            <br />
                            <b>Merchant id</b> : {plan.merchant}
                          </Card.Text>
                          
                              <Button variant="primary" size="lg" onClick={()=>handleDelete(index)}>
                                <center>Remove</center>
                              </Button>
                        
                        </Card.Body>
                      </Card>
                    </Col>
            
              )
          })
        }
          }
    
    return (
        <div>
           <div style={{ paddingTop: '60px' ,margin:'10px'}}>
          <div className="mt-3">
            {props.cartItem.length!=0 ?<><Row id="hide" xs={1} md={2} className="g-4">
            
            {getPurchasedPlans()}
          </Row>
          <div className="d-grid gap-2">
      <Button variant="outline-primary" size="lg"  onClick={handleSubscribe} style={{position: 'absolute',
    bottom: '0',
    width: '-webkit-fill-available',
    marginRight: '10px'}}>
      Subscribe
      </Button>
   
    </div>
            
          </>:<div id="unhide" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
          <img src={emptyCart} style={{height:'200px'}}/>
            <h1>Cart is Empty</h1>
            </div>
}
            
          </div>
        </div>  
             </div>
    );

} 

export default Cart;
