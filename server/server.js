const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const next = require('next');
require('dotenv').config()




const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const ROOT_URL = `http://localhost:${port}`;
let my_transaction_data = null;
let accessToken = '';

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();


// Nextjs's server prepared
nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const io = new socketIo.Server({path: '/Home'});
  io.attach(server);
  app.use(express.json());    
  app.use(express.urlencoded());

  const fetchTransactions = async (plaidItemId) => {
    
  const request = {
    access_token: accessToken,
    start_date: '2015-01-01',
    end_date: '2021-10-20'
  }
  
  try {
    const transactionsResponse = await client.transactionsGet(request);
    let transactions = transactionsResponse.data.transactions;
    const total_transactions = transactionsResponse.data.total_transactions;
    while(transactions.length < total_transactions) {
      const paginatedRequest = {
        access_token: accessToken,
        start_date:'2015-01-01',
        end_date: '2021-10-20',
        options: {
          offset: transactions.length,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    }
    // response.json(transactionsResponse.data);
    my_transaction_data = transactions;
    // return my_transaction_data;
  
    } catch(error) {
      console.log(error);
    }
  }
  
  app.post('/api/exchange_public_token', async function (req, res, next) {
    const publicToken = req.body.public_token;
    try {
      const response = await client.itemPublicTokenExchange({
        public_token: publicToken,
      });
      accessToken = response.data.access_token;
      const itemID = response.data.item_id;

      if (accessToken !== '') { res.redirect('/welcome')}
    } catch (error) {
      console.log(error);
    }
  });

  app.post('/api/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    // const user = await User.find(...);
    // const clientUserId = user.id;
    request = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'some unique identifier',
      },
      client_name: 'Plaid Test App',
      products: ['auth', 'identity'],
      language: 'en',
      webhook: 'http://a547-205-178-41-179.ngrok.io/hook',
      country_codes: ['US'],
    };
    try {
      const createTokenResponse = await client.linkTokenCreate(request);
      response.json(createTokenResponse.data);
    } catch (error) {
      // handle error
    }
  });

  app.post('/hook', (req, res) => {
    console.log(req.body);
    console.log("in the hook");
    fetchTransactions();
    res.status(200).end();    
    
  })

  app.get('/transactions_help', async function(req, res) {
    res.json(my_transaction_data);
  })

  app.get('/api/transactions', async function(req, res) {
    if (my_transaction_data != null) {
      res.json(my_transaction_data)
      res.end();
    }
    const request = {
      access_token: accessToken,
      start_date: '2021-10-01',
      end_date: '2021-10-02'
    }

    try {
      const transactionsResponse = await client.transactionsGet(request);
      let transactions = transactionsResponse.data.transactions;
      const total_transactions = transactionsResponse.data.total_transactions;
      while(transactions.length < total_transactions) {
        const paginatedRequest = {
          access_token: accessToken,
          start_date:'2018-01-01',
          end_data: '2020-02-01',
          options: {
            offset: transactions.length,
          },
        };
        const paginatedResponse = await client.transactionsGet(paginatedRequest);
        transactions = transactions.concat(
          paginatedResponse.data.transactions,
        );
      }
      response.json(transactionsResponse.data);
    } catch (error) {
      console.log(error);
    }
  })

  app.get('/api/balances', async function(request, response, next) {
    try {
      const balanceResponse = await client.accountsBalanceGet({
        access_token: accessToken,
      })
      console.log(accessToken)
      response.json(balanceResponse.data.accounts);
    } catch (error) {
      console.log(error);
    }
  });

  app.get('/api/investments', async function( request, response, next) {
    try  {
      const investmentsResponse = await client.investmentsHoldingsGet({
        access_token: accessToken,
      });
      response.json(investmentsResponse.data);
    } catch (error) {
      console.log(error);
    }
  })

  app.get('/api/accounts', async function (request, response, next) {
    console.log('access Token: ', accessToken);
    try {
      console.log('trying to get accounts data')
      const accountsResponse = await client.accountsGet({
        access_token: accessToken,
      });
      // prettyPrintResponse(accountsResponse);
      response.json(accountsResponse.data);
    } catch (error) {
      // prettyPrintResponse(error);
      return response.json(error.response);
    }
  });
  
  app.all('*', (req, res) => nextHandler(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`);
  });
});