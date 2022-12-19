import React, { useEffect, useState } from "react";
import "./App.css";
import useMetaMask from './hooks/metamask';
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3 from "web3";
import Button from "react-bootstrap/Button";
import { contractAbi, contractAddress } from "./config";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";
import { useWeb3React } from "@web3-react/core";

  
  const handleScrollToplans = () => {
    window.scrollTo(0, 570);
  };
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" centered="true">
          Product
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactPlayer width="760px" controls="true" url={props.url} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function User( props) {
    const { account,library } = useMetaMask()
  const [plans, setPlans] = useState([]);
  const [subs, setSubs] = useState([]);
  const [open, setOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/watch?v=ysz5S6PUM-U"
  );

  const urlArray = [
    "https://www.youtube.com/watch?v=ZE2HxTmxfrI",
    "https://www.youtube.com/watch?v=_J6G5g-nKg0",
  ];

  const onOpenModal = (index) => {
    if (urlArray.length > index) {
      setYoutubeUrl(urlArray[index]);
    } else {
      setYoutubeUrl("https://www.youtube.com/watch?v=ysz5S6PUM-U");
    }
    setOpen(!open);
  };
  

  const selectedItems= (planId)=>{
    props.addCartItem([...props.cartItem,planId]);
  }

  

  useEffect(() => {
    fetchData();
  }, [account, library]);

useEffect(()=>{
    if(props.subscribedPlans.length>0)
    {
        setTimeout(async() => {
          await props.addPrevPlans(props.subscribedPlans)
            await props.emptySubcribedPlans([]);
            document.getElementById("renew").style.display="block";
            alert('Subscription Expired');
        }, 30000);
    }
},[props.subscribedPlans])

const handleRenew =  async() => {
  const web3 = new Web3(library.provider);
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
   await props.prevPlans.forEach( element => {
    let plan = plans[element];
      contract.methods
      .subscribe(element)
      .send({ from: account, value: (plan.amount / 10 ** 18)* 10 ** 18 });

     
        
        
        
  }); 
  props.addSubcribedPlans(props.prevPlans)
        props.emptyPrevPlans([])
  document.getElementById("renew").style.display="none"; 
};

  const fetchData = async () => {
    if (account) {
      const web3 = new Web3(library.provider);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      // const tx = await contract.methods.pay(subscriber, payPlanId).send({from: account, value: payAmount * (10 ** 18)})
      const count = await contract.methods.getCount().call();
      console.log(count);

      const vPlan = [];
      const vSubs = [];

      for (var i = 0; i < count; i++) {
        var temp = await contract.methods.getPlan(i).call();
        vPlan.push(temp);
        temp = await contract.methods.getSubscriber(account, i).call();
        if (temp.subscriber !== "0x0000000000000000000000000000000000000000") {
          vSubs.push({ id: i, ...temp });
        }
      }
      setPlans(vPlan);
      setSubs(vSubs);
    }

  };
    return (
      <div style={{position: 'relative'}}>
        <div class="page-header">
          <div style={{ textAlign: "center" }}>
            <h1 class="title">
              <center>Smart Contract!!!</center>
            </h1>
            <p class="desc">Buy your recurring subscription now</p>
            <br></br>
            <Button variant="dark" onClick={handleScrollToplans}>View Plans</Button>
          </div>
        </div>
        <div style={{ margin: 10 }}>
          <div className="mt-3">
            <h2>
              <center>Plans</center>
            </h2>

            <Row xs={1} md={2} className="g-4">
              {plans.map((plan, index) => (
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
                      
                            {
                               props.subscribedPlans.includes(index)?<Button
                                variant="primary"
                                id={`Product${index}`}
                                onClick={() => onOpenModal(index)}
                              >
                                View Product
                              </Button>:<>
                              {
                                props.cartItem.includes(index)?<Button
                                 id={`Added${index}`}
                                 variant="secondary" disabled
                                >
                                 Added
                                </Button>:<>
                                {
                                   props.subscribedPlans.length!=0?<p style={{color:"red"}}><b>Inactive</b></p>:<Button
                                   id={`Cart${index}`}
                                    variant="primary"
                                    onClick={() => {
                                      selectedItems(index);
                                    }}
                                  >
                                    Add to cart
                                  </Button>
                                }
                                </>
                              
                              }
                              </>
                            }
                          
                        
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
            
          </div>
          
        </div>
        <MyVerticallyCenteredModal
          show={open}
          onHide={() => setOpen(false)}
          url={youtubeUrl}
        />
        <div className="d-grid gap-2" style={{margin: '60px'}}>
      <Button id="renew" variant="outline-primary" size="lg" onClick={handleRenew} style={{position: 'absolute',
    bottom: '0',
    width: '-webkit-fill-available',
    marginRight: '10px',
    display: 'none'
    }}>
      Renew
      </Button>
   
    </div>
        
      </div>
      
    );
  
}

export default User;
