
const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json())

  const customers = [];

function verifyIfCustomerExistsCPF(request, response, next){
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);
  if(!customer){
    response.status(400).json({Error: "User doesn't exists"});
  };

  request.customer = customer;

  return next();
};

function getBalance(customer, typeOperation) {
    
};

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const cpfAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if(cpfAlreadyExists){
    return response.status(400).json({error: "CPF already exists!"}).send();
  };

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });

  return response.status(201).send();
});

app.get("/statement", verifyIfCustomerExistsCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/makeDeposit", verifyIfCustomerExistsCPF, (request, response) => {
  const { customer } = request;
  const { amount, description, type } = request.body;

  const deposit = {
    amount,
    description,
    type,
    create_at: new Date()
  };

  customer.statement.push(deposit);
  return response.send().status(201);
});

app.post("/withdraw", verifyIfCustomerExistsCPF, (req, res) => {
  const customer = req;
  const { amount } = req.body;
  getBalance(customer);
  return res.send().status(200);
});

app.listen(3333);
