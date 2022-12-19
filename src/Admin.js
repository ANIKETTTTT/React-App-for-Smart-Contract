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

  
 
function Admin() {
    const { connect, disconnect, isActive, account, shouldDisable,library } = useMetaMask()
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState(0);
  

  const [active, setActive] = useState(true);

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
  
  const handleScrollToplans = () => {
    window.scrollTo(0, 870);
  };
  const handleCreatePlan = async () => {
    if (account) {
      const web3 = new Web3(library.provider);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      const tx = await contract.methods
        .createPlan(`${amount * 10 ** 18}`, frequency)
        .send({ from: account });
      setActive(true);
      console.log(tx);
      alert("Plan added successfully");
      fetchData();
    } else {
      alert("Please connect your wallet");
    }
  };
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
      <div>
        <div class="page-header">
          <div style={{ textAlign: "center" }}>
          <h1 class="title">
              <center><b>Welome Admin</b></center>
            </h1>
            <h1 class="title">
              <center>Smart Contract!!!</center>
            </h1>
            <p class="desc">Create Modules</p>
            <br></br>
            <Button variant="primary" size="lg" onClick={handleScrollToplans}>
              ADD PLANS
            </Button>
          </div>
        </div>
        <div style={{ margin: 10 }}>
          <div>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0" class="ls">
                <Accordion.Header>Create Plan</Accordion.Header>
                <Accordion.Body>
                  <table style={{width:'100%'}}>
                    <tr>
                      <td>
                        <p>Amount</p>
                        <input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </td>
                      <td>
                        <p>Duration</p>
                        <input
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          disabled={!active}
                          onClick={() => {
                            handleCreatePlan();
                            setActive(false);
                            fetchData();
                          }}
                        >
                          Create Plan
                        </Button>
                      </td>
                    </tr>
                  </table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
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
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
          </div>
        </div>
      </div>
    );
  
}

export default Admin;
