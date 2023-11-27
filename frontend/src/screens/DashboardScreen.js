import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

// Définition du reducer pour gérer l'état de la requête
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DashboardScreen = () => {
  // Utilisation du reducer pour gérer l'état
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Utilisation de useEffect pour effectuer la requête au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requête pour obtenir le résumé depuis le serveur
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        // Mise à jour de l'état en cas de succès
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        // Affichage des données dans la console (à des fins de débogage)
        console.log('Summary:', summary);
        console.log('Daily Orders:', summary.dailyOrders);
      } catch (err) {
        // Mise à jour de l'état en cas d'échec avec affichage de l'erreur
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    // Appel de la fonction fetchData pour effectuer la requête
    fetchData();
  }, [userInfo]);

  // Rendu du composant en fonction de l'état
  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        // Affichage du composant de chargement en cas de requête en cours
        <LoadingBox />
      ) : error ? (
        // Affichage du composant MessageBox en cas d'erreur
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // Affichage des données du résumé si la requête est réussie
        <>
          <Row>
            {/* Colonne pour les cartes utilisateur, commandes et ventes totales */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {(summary.users && summary.users[0]?.numUsers) || 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {(summary.orders && summary.orders[0]?.numOrders) || 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {(summary.orders &&
                      summary.orders[0]?.totalSales.toFixed(2)) ||
                      0}
                  </Card.Title>
                  <Card.Text> Total Sales</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Section des ventes */}
          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders && summary.dailyOrders.length === 0 ? (
              // Affichage d'un message si aucune vente n'est disponible
              <MessageBox>No Sale</MessageBox>
            ) : (
              // Affichage du graphique des ventes avec React Google Charts
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...(summary.dailyOrders || []).map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          {/* Section des catégories */}
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              // Affichage d'un message si aucune catégorie n'est disponible
              <MessageBox>No Category</MessageBox>
            ) : (
              // Affichage du graphique des catégories avec React Google Charts
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardScreen;
